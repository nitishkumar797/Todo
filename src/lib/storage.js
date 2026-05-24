const USERS_KEY = "todo-users";
const TASKS_KEY = "todo-tasks";
const SESSION_KEY = "todo-session";

const defaultUsers = [
  { id: "admin", name: "Admin", username: "admin", password: "admin123", role: "admin" },
  { id: "user1", name: "User One", username: "user1", password: "user123", role: "user" },
  { id: "user2", name: "User Two", username: "user2", password: "user234", role: "user" },
  { id: "user3", name: "User Three", username: "user3", password: "user345", role: "user" },
  { id: "user4", name: "User Four", username: "user4", password: "user456", role: "user" },
];

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureDefaultUsers() {
  const users = readJson(USERS_KEY);
  if (!Array.isArray(users) || users.length === 0) {
    writeJson(USERS_KEY, defaultUsers);
    return defaultUsers;
  }

  const existingUsernames = new Set(users.map((user) => user.username));
  const mergedUsers = [...users];

  defaultUsers.forEach((defaultUser) => {
    if (!existingUsernames.has(defaultUser.username)) {
      mergedUsers.push(defaultUser);
    }
  });

  if (mergedUsers.length !== users.length) {
    writeJson(USERS_KEY, mergedUsers);
  }

  return mergedUsers;
}

export function loadUsers() {
  return ensureDefaultUsers();
}

export function loadTasks() {
  const raw = readJson(TASKS_KEY);
  return Array.isArray(raw) ? raw : [];
}

export function saveTasks(tasks) {
  writeJson(TASKS_KEY, tasks);
}

export function loadSession() {
  return readJson(SESSION_KEY);
}

export function saveSession(user) {
  writeJson(SESSION_KEY, {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  });
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function authenticate(username, password) {
  const users = ensureDefaultUsers();
  return users.find((user) => user.username === username && user.password === password) || null;
}
