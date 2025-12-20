# To‑Do App (JSON Server)

A modern To‑Do application connected to a real backend using JSON Server.  
Users can add, edit, complete, and delete tasks with live API updates.

## Features
- Add tasks (title, description, category, due date)
- Display tasks in a styled layout
- Mark tasks as completed or in‑progress
- Edit existing tasks
- Delete tasks
- **Light & Dark theme toggle**
- Shows count of **Completed** and **In‑Progress** tasks

## JSON Server API
- GET /todos — load tasks
- POST /todos — create task
- PATCH /todos/:id — update task
- DELETE /todos/:id — delete task

## Setup
```bash
npm install -g json-server
json-server --watch db.json --port 3000
```

Open `index.html` in your browser to start the app.
```
