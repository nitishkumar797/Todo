import TodoApp from "./TodoApp.jsx";

export default function Dashboard({ currentUser, users, tasks, onTasksChange, onLogout }) {
  const allTasks = tasks;
  const myTasks = tasks.filter((task) => task.userId === currentUser.id);
  const visibleTasks = currentUser.role === "admin" ? allTasks : myTasks;

  const totalTasks = visibleTasks.length;
  const completedTasks = visibleTasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const averageDelay = visibleTasks.length
    ? Math.round(
        visibleTasks.reduce((sum, task) => {
          const expected = new Date(task.expectedAt);
          const actual = task.completedAt ? new Date(task.completedAt) : new Date();
          const diffHours = (actual - expected) / (1000 * 60 * 60);
          return sum + Math.max(0, Math.round(diffHours));
        }, 0) / visibleTasks.length
      )
    : 0;

  const userSummaries = users.map((user) => {
    const userTasks = allTasks.filter((task) => task.userId === user.id);
    return {
      ...user,
      total: userTasks.length,
      completed: userTasks.filter((task) => task.completed).length,
      pending: userTasks.filter((task) => !task.completed).length,
    };
  });

  return (
    <>
      <section className="dashboard-header">
        <div>
          <h1>Welcome back, {currentUser.name}</h1>
          <p>
            {currentUser.role === "admin"
              ? "Review all user records below."
              : "Track your tasks, completion status, and delays."}
          </p>
        </div>
        <button className="logout-button" onClick={onLogout} type="button">
          Logout
        </button>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <span>Total tasks</span>
          <strong>{totalTasks}</strong>
        </article>
        <article className="dashboard-card">
          <span>Completed</span>
          <strong>{completedTasks}</strong>
        </article>
        <article className="dashboard-card">
          <span>Pending</span>
          <strong>{pendingTasks}</strong>
        </article>
        <article className="dashboard-card">
          <span>Average delay</span>
          <strong>{averageDelay} h</strong>
        </article>
      </section>

      <section className="dashboard-panel">
        <h2>{currentUser.role === "admin" ? "Task records" : "My task records"}</h2>
        <TodoApp
          currentUser={currentUser}
          tasks={allTasks}
          users={users}
          onTasksChange={onTasksChange}
        />
      </section>

      {currentUser.role === "admin" && (
        <section className="admin-panel">
          <h2>User summaries</h2>
          <div className="user-summary-grid">
            {userSummaries.map((user) => (
              <article key={user.id} className="user-summary-card">
                <strong>{user.name}</strong>
                <div>{user.role === "admin" ? "Admin" : "User"}</div>
                <small>{user.total} tasks</small>
                <div>{user.completed} completed</div>
                <div>{user.pending} pending</div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
