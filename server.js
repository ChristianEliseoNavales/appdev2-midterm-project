// Importing the modules used in the application
const http = require('http');
const fs = require('fs');
const { EventEmitter } = require('events');

// Defining the server's hostname and port
const port = 3000;
const hostname = 'localhost';

// This is the event logger that will log all the requests to the log.txt file
const logger = new EventEmitter();
logger.on('log', (message) => {
  const logText = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFile('logs.txt', logText, (err) => {
    if (err) console.error('Error writing to log:', err);
  });
});

// This function parses the request body and calls the callback with the parsed data
const parseBody = (req, callback) => {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      callback(null, parsed);
    } catch (e) {
      callback(e);
    }
  });
};

// This function reads the todos from the todos.json file and calls the callback with the data
const readTodos = (callback) => {
  fs.readFile('todos.json', 'utf-8', (err, data) => {
    if (err) return callback(err);
    try {
      const todos = JSON.parse(data);
      callback(null, todos);
    } catch (e) {
      callback(e);
    }
  });
};

// This function writes the todos to the todos.json file and calls the callback when done
const writeTodos = (todos, callback) => {
  fs.writeFile('todos.json', JSON.stringify(todos, null, 2), callback);
};

// This function creates the server and handles incoming requests
const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const urlParts = urlObj.pathname.split('/').filter(Boolean);
  const method = req.method;
  logger.emit('log', `${method} ${req.url}`);

  if (urlParts[0] !== 'todos') {
    res.statusCode = 404;
    res.end('Todos Not found!');
    return;
  }

  readTodos((err, todos) => {
    if (err) {
      res.statusCode = 500;
      res.end('Error: Failed to read todos');
      return;
    }

    // GET method to retrieve all todos or filter by completed status
    if (method === 'GET' && urlParts.length === 1) {
      const completed = urlObj.searchParams.get('completed');
      if (completed !== null) {
        const isCompleted = completed === 'true';
        todos = todos.filter(t => t.completed === isCompleted);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(todos));
    }

    else if (method === 'GET' && urlParts.length === 2) {
      const id = parseInt(urlParts[1]);
      const todo = todos.find(t => t.id === id);
      if (!todo) {
        res.statusCode = 404;
        res.end('Todo not found!');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(todo));
    }

    // POST (Create) method to add a new todo
    else if (method === 'POST' && urlParts.length === 1) {
      parseBody(req, (err, body) => {
        if (err || !body.title) {
          res.statusCode = 400;
          res.end('Error: Invalid or missing title');
          return;
        }

        if (body.id !== undefined && todos.some(t => t.id === body.id)) {
          res.statusCode = 400;
          res.end('ID already exists');
          return;
        }

        const newTodo = {
          id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
          title: body.title,
          completed: body.completed ?? false
        };

        todos.push(newTodo);
        writeTodos(todos, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end('Error: Failed to write todos');
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(newTodo));
        });
      });
    }

    //PUT (Update) method to update an existing todo
    else if (method === 'PUT' && urlParts.length === 2) {
      const id = parseInt(urlParts[1]);
      const index = todos.findIndex(t => t.id === id);
      if (index === -1) {
        res.statusCode = 404;
        res.end('Todo not found');
        return;
      }

      parseBody(req, (err, body) => {
        if (err || (!body.title && typeof body.completed !== 'boolean')) {
          res.statusCode = 400;
          res.end('Error: Invalid data');
          return;
        }

        todos[index] = { ...todos[index], ...body };

        writeTodos(todos, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end('Error: Failed to update todos');
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(todos[index]));
        });
      });
    }

    // DELETE method to delete a todo
    else if (method === 'DELETE' && urlParts.length === 2) {
      const id = parseInt(urlParts[1]);
      const index = todos.findIndex(t => t.id === id);
      if (index === -1) {
        res.statusCode = 404;
        res.end('Todo not found');
        return;
      }

      const deleted = todos.splice(index, 1);
      writeTodos(todos, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('Error: Failed to delete todo');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(deleted[0]));
      });
    }

    // If the route or method is not recognized, return a 404 error
    else {
      res.statusCode = 404;
      res.end('Error: Endpoint not found');
    }
  });
});

// Starting the server and listening on the specified port and hostname
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
