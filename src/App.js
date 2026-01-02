import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [status, setStatus] = useState("Pending");
  const [filter, setFilter] = useState("ALL");
  const [editId, setEditId] = useState(null);

  /* Load from localStorage */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks"));
    if (stored) setTasks(stored);
  }, []);

  /* Save to localStorage */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* Add / Edit Task */
  const addTask = () => {
    if (taskText.trim() === "") return;

    if (editId) {
      setTasks(tasks.map(task =>
        task.id === editId ? { ...task, text: taskText, status } : task
      ));
      setEditId(null);
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        text: taskText,
        status
      }]);
    }

    setTaskText("");
    setStatus("Pending");
  };

  const editTask = (task) => {
    setTaskText(task.text);
    setStatus(task.status);
    setEditId(task.id);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "ALL") return true;
    return task.status === filter;
  });

  return (
    <div className="app">
      <h1>✨ My To-Do List</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter task..."
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
        />

        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option>Pending</option>
          <option>Doing</option>
          <option>Completed</option>
        </select>

        <button onClick={addTask}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="filters">
  <button
    className={filter === "ALL" ? "active" : ""}
    onClick={() => setFilter("ALL")}
  >
    All
  </button>

  <button
    className={filter === "Pending" ? "active" : ""}
    onClick={() => setFilter("Pending")}
  >
    Pending
  </button>

  <button
    className={filter === "Doing" ? "active" : ""}
    onClick={() => setFilter("Doing")}
  >
    Doing
  </button>

  <button
    className={filter === "Completed" ? "active" : ""}
    onClick={() => setFilter("Completed")}
  >
    Completed
  </button>
</div>


      {filteredTasks.length === 0 ? (
        <p className="empty">No Tasks Found 🚫</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id} className={task.status.toLowerCase()}>
              <span>{task.text}</span>
              <small>{task.status}</small>
              <div>
                <button className="edit" onClick={() => editTask(task)}>Edit</button>
                <button className="delete" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
