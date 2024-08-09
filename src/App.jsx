import { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTask, setEditingTask] = useState('');
  const [editingTaskDate, setEditingTaskDate] = useState('');
  const [editingTaskTime, setEditingTaskTime] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'

  // Updated formatDate function
  const formatDate = (date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const addTask = () => {
    if (newTask.trim()) {
      const formattedDate = taskDate ? formatDate(taskDate) : formatDate(new Date());
      const newTaskEntry = {
        text: newTask,
        date: formattedDate.date,
        time: formattedDate.time,
        completed: false,
      };
      setTaskHistory([...taskHistory, tasks]);
      setTasks([...tasks, newTaskEntry]);
      setNewTask('');
      setTaskDate('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior
    }
  };

  const removeTask = (index) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTaskHistory([...taskHistory, tasks]);
      setTasks(updatedTasks);
    }
  };

  const editTask = (index) => {
    setEditingIndex(index);
    setEditingTask(tasks[index].text);
    setEditingTaskDate(tasks[index].date);
    setEditingTaskTime(tasks[index].time);
  };

  const saveEditTask = () => {
    if (editingTask.trim()) {
      const formattedDate = editingTaskDate ? formatDate(editingTaskDate + 'T' + editingTaskTime) : formatDate(new Date());
      const updatedTasks = tasks.map((task, index) =>
        index === editingIndex ? { ...task, text: editingTask, date: formattedDate.date, time: formattedDate.time } : task
      );
      setTaskHistory([...taskHistory, tasks]);
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditingTask('');
      setEditingTaskDate('');
      setEditingTaskTime('');
    }
  };

  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTaskHistory([...taskHistory, tasks]);
    setTasks(updatedTasks);
  };

  const markAllCompleted = () => {
    if (window.confirm('Are you sure you want to mark all tasks as completed?')) {
      const updatedTasks = tasks.map((task) => ({ ...task, completed: true }));
      setTaskHistory([...taskHistory, tasks]);
      setTasks(updatedTasks);
    }
  };

  const deleteAllTasks = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      setTaskHistory([...taskHistory, tasks]);
      setTasks([]);
    }
  };

  const undoAll = () => {
    if (taskHistory.length > 0) {
      const previousState = taskHistory[taskHistory.length - 1];
      setTaskHistory(taskHistory.slice(0, -1));
      setTasks(previousState);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // 'all'
  });

  return (
    <div className="App">
      <header className="header">
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-logo">LexMeet</div>
          </div>
        </nav>
      </header>
      <div className="main-content">
        <aside className="task-sidebar">
          <h2>To-Do List:</h2>
          <div className="task-filter">
            <button onClick={() => setFilter('all')}>All</button>
            <button onClick={() => setFilter('completed')}>Completed</button>
            <button onClick={() => setFilter('pending')}>Pending</button>
          </div>
          <div className="task-list-container">
            <ul className="task-list">
              {filteredTasks.map((task, index) => {
                return (
                  <li key={index} className={task.completed ? 'completed' : ''}>
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleCompletion(index)}
                      />
                    </label>
                    <div className="task-text">{task.text}</div>
                    <div className="task-date">
                      <div className="date">Date: {task.date}</div>
                      <div className="time">Time: {task.time}</div>
                    </div>
                    {editingIndex === index ? (
                      <>
                        <input
                          type="text"
                          value={editingTask}
                          onChange={(e) => setEditingTask(e.target.value)}
                        />
                        <input
                          type="date"
                          value={editingTaskDate}
                          onChange={(e) => setEditingTaskDate(e.target.value)}
                        />
                        <input
                          type="time"
                          value={editingTaskTime}
                          onChange={(e) => setEditingTaskTime(e.target.value)}
                        />
                        <div className="buttons-container">
                          <button className="save-button" onClick={saveEditTask}>Save</button>
                          <button className="cancel-button" onClick={() => setEditingIndex(null)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <div className="buttons-container">
                        <button className="edit-button" onClick={() => editTask(index)}>Edit</button>
                        <button className="remove-button" onClick={() => removeTask(index)}>Delete</button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <button className="done-all-button" onClick={markAllCompleted}>Done All</button>
          <button className="delete-all-button" onClick={deleteAllTasks}>Delete All</button>
          <button className="undo-all-button" onClick={undoAll} disabled={taskHistory.length === 0}>Undo All</button>
        </aside>
        <main className="content-area">
          <h1>Welcome to My App</h1>
          <div className="task-input">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task"
            />
            <input
              type="date"
              value={taskDate ? new Date(taskDate).toISOString().substring(0, 10) : ''}
              onChange={(e) => setTaskDate(e.target.value)}
            />
            <input
              type="time"
              value={taskDate ? new Date(taskDate).toISOString().substring(11, 16) : ''}
              onChange={(e) => setTaskDate((prev) => prev ? prev.split('T')[0] + 'T' + e.target.value : e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
