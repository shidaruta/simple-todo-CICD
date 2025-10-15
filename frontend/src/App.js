import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // We'll add styles here

const API_URL = "/todos"; // Use proxy in package.json

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!task) return;
    await axios.post(API_URL, { task });
    setTask("");
    fetchTodos();
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task);
  };

  const updateTodo = async (id) => {
    await axios.put(`${API_URL}/${id}`, { task: editTask });
    setEditId(null);
    setEditTask("");
    fetchTodos();
  };

  const toggleComplete = async (id, completed) => {
    await axios.put(`${API_URL}/${id}`, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  return (
    <div className="container">
      <h1>📝 My To-Do App</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        <p style={{"color":"#e9d502"}}>Note: Click on task to toggle completion</p>
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  className="edit-input"
                />
                <button className="save-btn" onClick={() => updateTodo(todo.id)}>Save</button>
                <button className="cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  className="task-text"
                  onClick={() => toggleComplete(todo.id, todo.completed)}
                >
                  {todo.task}
                </span>
                <div className="btn-group">
                  <button className="edit-btn" onClick={() => startEdit(todo)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
