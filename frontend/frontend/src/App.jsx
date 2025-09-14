import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://todo-app-yn7p.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await axios.post(API_URL, { title: newTodo });
    setNewTodo("");
    fetchTodos();
  };

  const toggleComplete = async (id, completed) => {
    await axios.patch(`${API_URL}/${id}`, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  const startEdit = (id, title) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;
    await axios.patch(`${API_URL}/${id}`, { title: editingTitle });
    setEditingId(null);
    setEditingTitle("");
    fetchTodos();
  };

  return (
    <div className="app">
      <h1 className="title">Todo App</h1>

      <div className="input-area">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
            />

            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(todo._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{todo.title}</span>
                <div className="actions">
                  <button onClick={() => startEdit(todo._id, todo.title)}>
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
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
