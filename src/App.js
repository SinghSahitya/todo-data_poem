import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State variables
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // On mount, fetch todos from the API
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos');
    }
    setLoading(false);
  };

  const addTodo = async (title) => {
    if (!title.trim()) return;
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setError('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = todos.filter(todo =>
    filter === 'all'
      ? true
      : filter === 'active'
      ? !todo.completed
      : todo.completed
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Task Manager</h1>
        <FilterButtons currentFilter={filter} setFilter={setFilter} />
      </header>

      <main className="main-content">
        <AddTodo
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleAddSubmit={handleAddSubmit}
        />

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading tasks...
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            deleteTodo={deleteTodo}
            toggleComplete={toggleComplete}
          />
        )}
      </main>
    </div>
  );
}

function FilterButtons({ currentFilter, setFilter }) {
  const filters = ['all', 'active', 'completed'];
  return (
    <div className="filter-buttons">
      {filters.map(f => (
        <button
          key={f}
          className={`tab-btn ${currentFilter === f ? 'active' : ''}`}
          onClick={() => setFilter(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

function AddTodo({ newTodoTitle, setNewTodoTitle, handleAddSubmit }) {
  return (
    <form className="add-todo" onSubmit={handleAddSubmit}>
      <div className="input-group">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-button">
          Add Task
        </button>
      </div>
    </form>
  );
}

function TodoList({ todos, deleteTodo, toggleComplete }) {
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleComplete={toggleComplete}
        />
      ))}
    </div>
  );
}

function TodoItem({ todo, deleteTodo, toggleComplete }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-detail">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
          className="todo-checkbox"
        />
        <span className="todo-text">{todo.title}</span>
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="delete-button"
        aria-label="Delete task"
      >
        &times;
      </button>
    </div>
  );
}

export default App;
