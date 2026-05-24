import { useEffect, useMemo, useState } from "react";
import TodoItem from "./TodoItem.jsx";

function defaultExpectedCompletion() {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  return date.toISOString().slice(0, 16);
}

function createTask({ name, duration, expectedAt, userId }) {
  return {
    id: crypto.randomUUID(),
    name,
    duration,
    expectedAt,
    userId,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
  };
}

function getDelayHours(task) {
  const expected = new Date(task.expectedAt);
  const actual = task.completedAt ? new Date(task.completedAt) : new Date();
  const diffHours = (actual - expected) / (1000 * 60 * 60);
  return Math.max(0, Math.round(diffHours));
}

export default function TodoApp({ currentUser, tasks, users, onTasksChange }) {
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [expectedCompletion, setExpectedCompletion] = useState(defaultExpectedCompletion());
  const [editingId, setEditingId] = useState(null);
  const [taskOwner, setTaskOwner] = useState(currentUser.id);

  useEffect(() => {
    setTaskOwner(currentUser.id);
  }, [currentUser.id]);

  const ownerMap = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user.name])),
    [users]
  );

  const visibleTasks = useMemo(
    () =>
      currentUser.role === "admin"
        ? tasks
        : tasks.filter((task) => task.userId === currentUser.id),
    [currentUser.id, currentUser.role, tasks]
  );

  const clearForm = () => {
    setTaskName("");
    setTaskDuration("");
    setExpectedCompletion(defaultExpectedCompletion());
    setEditingId(null);
    setTaskOwner(currentUser.id);
  };

  const saveTask = (event) => {
    event.preventDefault();
    const name = taskName.trim();
    const duration = taskDuration.trim();

    if (!name || !duration || !expectedCompletion) {
      return;
    }

    const nextTasks = [...tasks];
    const targetUserId = currentUser.role === "admin" ? taskOwner : currentUser.id;

    if (editingId) {
      const index = nextTasks.findIndex((task) => task.id === editingId);
      if (index !== -1) {
        nextTasks[index] = {
          ...nextTasks[index],
          name,
          duration,
          expectedAt: expectedCompletion,
          userId: targetUserId,
        };
      }
      onTasksChange(nextTasks);
      clearForm();
      return;
    }

    nextTasks.push(createTask({ name, duration, expectedAt: expectedCompletion, userId: targetUserId }));
    onTasksChange(nextTasks);
    clearForm();
  };

  const toggleTask = (id) => {
    const nextTasks = tasks.map((task) => {
      if (task.id !== id) {
        return task;
      }

      const completed = !task.completed;
      return {
        ...task,
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      };
    });

    onTasksChange(nextTasks);
  };

  const editTask = (task) => {
    setTaskName(task.name);
    setTaskDuration(task.duration);
    setExpectedCompletion(task.expectedAt);
    setEditingId(task.id);
    setTaskOwner(task.userId);
  };

  const deleteTask = (id) => {
    const nextTasks = tasks.filter((task) => task.id !== id);
    onTasksChange(nextTasks);
    if (editingId === id) {
      clearForm();
    }
  };

  const remaining = visibleTasks.filter((task) => !task.completed).length;

  return (
    <section className="todo-card" id="tasks">
      <h2>{currentUser.role === "admin" ? "Manage all tasks" : "Manage your tasks"}</h2>

      <form onSubmit={saveTask} className="todo-form">
        {currentUser.role === "admin" && (
          <label>
            Assign to user
            <select value={taskOwner} onChange={(event) => setTaskOwner(event.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="input-row">
          <label>
            Task name
            <input
              type="text"
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="Task name"
              aria-label="Task name"
            />
          </label>

          <label>
            Duration
            <input
              type="text"
              value={taskDuration}
              onChange={(event) => setTaskDuration(event.target.value)}
              placeholder="e.g. 2h"
              aria-label="Task duration"
            />
          </label>
        </div>

        <label className="full-width">
          Expected completion
          <input
            type="datetime-local"
            value={expectedCompletion}
            onChange={(event) => setExpectedCompletion(event.target.value)}
            aria-label="Expected completion date and time"
          />
        </label>

        <div className="form-actions">
          <button type="submit">{editingId ? "Save changes" : "Add task"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={clearForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="summary">
        {remaining} task{remaining === 1 ? "" : "s"} remaining of {visibleTasks.length}
      </div>

      {visibleTasks.length === 0 ? (
        <div className="empty">No tasks available yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="todo-table">
            <thead>
              <tr>
                <th>Task name</th>
                <th>Duration</th>
                <th>Completed</th>
                <th>Expected completion</th>
                <th>Delay (hours)</th>
                {currentUser.role === "admin" && <th>Owner</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleTasks.map((task) => (
                <TodoItem
                  key={task.id}
                  todo={task}
                  onToggle={() => toggleTask(task.id)}
                  onEdit={() => editTask(task)}
                  onDelete={() => deleteTask(task.id)}
                  delayHours={getDelayHours(task)}
                  ownerName={ownerMap[task.userId]}
                  showOwner={currentUser.role === "admin"}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
