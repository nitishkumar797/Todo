# React Todo App

This project is a small React TODO application built with Vite.

## Project structure

- `package.json` - project metadata, dependencies, and scripts.
- `vite.config.js` - Vite configuration for React support.
- `index.html` - HTML entry point that loads the React app.
- `src/main.jsx` - application entry file that mounts `App` into the DOM.
- `src/App.jsx` - top-level app shell that handles login, session state, and data persistence.
- `src/components/Login.jsx` - user login screen with admin and regular user authentication.
- `src/components/Dashboard.jsx` - dashboard view with summary cards, admin user records, and task widgets.
- `src/components/TodoApp.jsx` - task manager for creating, editing, completing, and deleting records.
- `src/components/TodoItem.jsx` - reusable row component for task records with owner display.
- `src/lib/storage.js` - local storage helpers for users, tasks, and saved sessions.
- `src/index.css` - global styles for page background and typography.
- `src/App.css` - styling for login, dashboard, task form, and task table.
- `.gitignore` - files and folders to ignore in Git.

## How the app works

1. `src/main.jsx` renders the `<App />` component inside the `#root` element.
2. `src/App.jsx` loads the todo application and styles.
3. `src/components/Login.jsx` handles username/password authentication against a local data set.
4. `src/components/Dashboard.jsx` displays stats for the signed-in user or all users when logged in as admin.
5. `src/components/TodoApp.jsx` manages task records, including:
   - per-user task storage
   - task name, duration, expected completion, and delay tracking
   - edit and delete operations
6. `src/components/TodoItem.jsx` renders table rows with task status and admin owner information.

## Commands

- `npm install` - install dependencies.
- `npm run dev` - start the development server.
- `npm run build` - build the production bundle.
- `npm run preview` - preview the built app.
