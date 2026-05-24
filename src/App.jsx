import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import {
  authenticate,
  clearSession,
  ensureDefaultUsers,
  loadSession,
  loadTasks,
  saveTasks,
  saveSession,
} from "./lib/storage.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadedUsers = ensureDefaultUsers();
    const loadedTasks = loadTasks();
    const sessionUser = loadSession();

    setUsers(loadedUsers);
    setTasks(loadedTasks);
    if (sessionUser) {
      setCurrentUser(sessionUser);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    saveSession(user);
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
  };

  const handleTasksChange = (nextTasks) => {
    setTasks(nextTasks);
    saveTasks(nextTasks);
  };

  return (
    <div className="app-shell">
      <div className="page-frame">
        {currentUser ? (
          <Dashboard
            currentUser={currentUser}
            users={users}
            tasks={tasks}
            onTasksChange={handleTasksChange}
            onLogout={handleLogout}
          />
        ) : (
          <Login onLogin={handleLogin} authenticate={authenticate} />
        )}
      </div>
    </div>
  );
}
