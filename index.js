const express = require('express');
const path = require('path');
const app = express();
const port = 9000;

app.use(express.json());
app.use(express.static(__dirname));

// Serve the UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// array 
let tasks = [
    {id:1, name:"running", status:"Incomplete"},
    {id:2, name:"reading", status:"Incomplete"},
    {id:3, name:"coding", status:"Incomplete"},
    {id:4, name:"walking", status:"Incomplete"},
    {id:5, name:"writing", status:"Incomplete"}
];

app.get("/tasks", (req, res) => {
    res.status(200).json({status:"success", data:tasks});
});
app.get("/tasks/:id", (req, res) => {
    const {id} = req.params;
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
        return res.status(404).json({status:"error", message:"Task not found"});
    }
    res.status(200).json({status:"success", data:task});
});

// add new task 

const nextId = () => {
    return tasks.length ? tasks.length + 1 : 1;
}
app.post("/tasks", (req, res) => {
    const {name, status} = req.body;
    if (!name || typeof status !== 'string') {
        return res.status(400).json({status:"error", message:"Name and status are required"});
    }
    const newTask = {id: nextId(), name, status};
    tasks.push(newTask);
    res.status(201).json({status:"success", data:newTask});
});
// delete task
app.delete("/tasks/:id", (req, res) => {
    const {id} = req.params;
    const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).json({status:"error", message:"Task not found"});
    }
    tasks.splice(taskIndex, 1);
    // Reassign sequential ids so IDs remain compact after deletions
    tasks = tasks.map((t, i) => ({ ...t, id: i + 1 }));
    res.status(200).json({status:"success", message:"Task deleted", data: tasks});
});

// update task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const idx = tasks.findIndex(t => t.id === parseInt(id));
  if (idx === -1) return res.status(404).json({ status: 'error', message: 'Task not found' });
  if (typeof name !== 'string' || typeof status !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid payload' });
  tasks[idx] = { ...tasks[idx], name, status };
  res.status(200).json({ status: 'success', data: tasks[idx] });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});