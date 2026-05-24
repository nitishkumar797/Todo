export default function TodoItem({ todo, onToggle, onDelete, onEdit, delayHours, ownerName, showOwner }) {
  return (
    <tr className={`todo-row ${todo.completed ? "completed" : "pending"}`}>
      <td className="task-name">{todo.name}</td>
      <td>{todo.duration}</td>
      <td>
        <label className="checkbox-cell">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={onToggle}
            aria-label={`Mark ${todo.name} as ${todo.completed ? "incomplete" : "complete"}`}
          />
          <span>{todo.completed ? "Done" : "Pending"}</span>
        </label>
      </td>
      <td>{new Date(todo.expectedAt).toLocaleString()}</td>
      <td>{delayHours} h</td>
      {showOwner && <td>{ownerName || "Unknown"}</td>}
      <td className="row-actions">
        <button className="edit" onClick={onEdit} type="button">
          Edit
        </button>
        <button className="danger" onClick={onDelete} type="button">
          Delete
        </button>
      </td>
    </tr>
  );
}
