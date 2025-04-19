# 📚 AppDev2 Midterm Project – CRUD HTTP Server Using The File System Module

## 👤 My Profile
**Name:** Christian Eliseo N. Isip  
**Course:** BS Information Systems 3   

---

## 📌 Project Overview

This project is a simple RESTful API built with **Node.js** that mimics the `/todos` endpoint from [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos). It uses the built-in `fs` module to handle data storage in a local `todos.json` file and the `events` module for request logging listed in the log.txt file.

### ✨ Key Features
- Create, Read, Update, and Delete (CRUD) todo items.
- Stores all todos inside `todos.json`.
- Logs all API requests with timestamps in `logs.txt`.
- Handles query filtering by completed status (`true` or `false`).

---

## 🛠️ Installation Guide

### 1. 📁 Clone the Repository

1. Open terminal or CMD.
2. Change Directory (cd) to your desired folder or file location.
3. Enter this git command:
   - git clone https://github.com/YOUR_USERNAME/appdev2-midterm-project.git

### 2. 🔣 Run the Code (Server)

    Open your VSCode Terminal and enter this command:
   - node server.js 

### 3. ⚡ Accesing the server link

   - Use Thunder Client (a VS Code extension) through this URL: http://localhost:3000/
    
#### To test the following endpoints and methods:

#### 📖 GET METHOD: (Read)
   - GET /todos
     - To retrieve all todos.
   - GET /todos?completed=true
     - To filter all todos with completed = true.
   - GET /todos?completed=false
     - To filter all todos with completed = false.
   - GET /todos/:id
     - To retrieve a specific todo by ID.

#### 📬 POST METHOD: (Create)
   - POST /todos
     - Adds a new todo.
     - On Thunder Client, click body and enter this JSON Object to add a new todo:
     
        ->  { "id": 1, "title": "Learn Node.js", "completed": false}

#### ⬆️ PUT METHOD: (Update)
   - PUT /todos/:id
     - Updates a specific todo by ID.
     - On Thunder Client, click body and enter this JSON Object to update a todo:
     
        ->  {"title": "Updated title", "completed": true}

#### ❌ DELETE METHOD: (Delete)
   - DELETE /todos/:id
     - Deletes a specific todo by ID.

---
## 📹 Video Demonstration

    You can access my video demonstration through this link: 
    
    https://drive.google.com/file/d/1PBFwsl3PLtISpjH-eHK8DnmINK4Wz194/view?usp=sharing