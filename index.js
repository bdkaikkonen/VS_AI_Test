// Node.js Hello World Web Server with Express and JWT Authentication
const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Demo users
const users = new Map([
  ['admin', { password: 'password', id: 1, name: 'Administrator' }],
  ['user', { password: '123456', id: 2, name: 'Regular User' }],
  ['demo', { password: 'demo', id: 3, name: 'Demo User' }]
]);

// JWT middleware for protected routes
const jwtMiddleware = expressJwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  }
});

// Common CSS styles
const commonStyles = `
  body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 50px;
    background-color: #f0f0f0;
  }
  .container {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: inline-block;
    max-width: 500px;
  }
  h1 { color: #333; margin-bottom: 20px; }
  p { color: #666; }
  .form-group {
    margin: 20px 0;
  }
  input[type="text"], input[type="password"] {
    padding: 10px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 5px;
    width: 200px;
    margin: 5px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px;
  }
  button:hover {
    background-color: #0056b3;
  }
  .logout-btn {
    background-color: #dc3545;
  }
  .logout-btn:hover {
    background-color: #c82333;
  }
  .greeting {
    font-size: 24px;
    color: #28a745;
    margin: 20px 0;
    font-weight: bold;
  }
  .error {
    color: #dc3545;
    margin: 10px 0;
  }
  .success {
    color: #28a745;
    margin: 10px 0;
  }
  .nav {
    margin-bottom: 20px;
  }
  .jwt-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
    font-size: 12px;
    word-break: break-all;
  }
`;

// Login page
function getLoginPage(errorMessage = '') {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>JWT Login - Node.js Server</title>
        <style>${commonStyles}</style>
    </head>
    <body>
        <div class="container">
            <h1>JWT Authentication Login</h1>
            
            ${errorMessage ? `<div class="error">${errorMessage}</div>` : ''}
            
            <form method="POST" action="/api/login">
                <div class="form-group">
                    <input type="text" name="username" placeholder="Username" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </div>
            </form>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
                <h3>Demo Accounts:</h3>
                <p><strong>admin</strong> / password</p>
                <p><strong>user</strong> / 123456</p>
                <p><strong>demo</strong> / demo</p>
            </div>
            
            <div style="margin-top: 20px; font-size: 12px; color: #666;">
                <p>Using express-jwt v0.1.3 for JWT authentication</p>
            </div>
            
            <p>Current time: ${new Date().toISOString()}</p>
        </div>
    </body>
    </html>
  `;
}

// Main application page
function getMainPage(user, name, token) {
  const greeting = name ? `Hello, ${name}!` : `Hello, ${user.name}!`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>JWT Protected - Hello World</title>
        <style>${commonStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="nav">
                <p>Welcome, <strong>${user.name}</strong> (ID: ${user.id})!</p>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
            
            <h1>JWT Protected Hello World</h1>
            
            <div class="greeting">${greeting}</div>
            
            <form method="GET" action="/hello">
                <input type="hidden" name="token" value="${token}" />
                <div class="form-group">
                    <input type="text" name="name" placeholder="Enter your name" value="${name || ''}" />
                    <button type="submit">Say Hello</button>
                </div>
            </form>
            
            <div class="jwt-info">
                <strong>JWT Token:</strong><br>
                ${token}
            </div>
            
            <p>Welcome to your JWT-protected Node.js web server!</p>
            <p>Using express-jwt v0.1.3</p>
            <p>Current time: ${new Date().toISOString()}</p>
            <p>Server is running on port ${port}</p>
        </div>
        
        <script>
            function logout() {
                window.location.href = '/logout';
            }
        </script>
    </body>
    </html>
  `;
}

// Routes

// Login page
app.get('/login', (req, res) => {
  res.send(getLoginPage());
});

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.send(getLoginPage('Username and password are required'));
  }
  
  const user = users.get(username);
  if (!user || user.password !== password) {
    return res.send(getLoginPage('Invalid username or password'));
  }
  
  // Create JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      username: username,
      name: user.name 
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
  
  // Redirect to main page with token
  res.redirect(`/hello?token=${token}`);
});

// Protected main page
app.get('/hello', jwtMiddleware, (req, res) => {
  const name = req.query.name;
  const token = req.query.token;
  const user = req.user;
  
  res.send(getMainPage(user, name, token));
});

// Protected root route
app.get('/', jwtMiddleware, (req, res) => {
  const token = req.query.token;
  const user = req.user;
  
  res.send(getMainPage(user, null, token));
});

// Logout
app.get('/logout', (req, res) => {
  res.redirect('/login');
});

// JWT info API endpoint
app.get('/api/verify', jwtMiddleware, (req, res) => {
  res.json({
    message: 'JWT token is valid',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Error handling for JWT
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.redirect('/login');
  } else {
    next(err);
  }
});

// Default route - redirect to login
app.get('*', (req, res) => {
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log('Press Ctrl+C to stop the server');
  console.log('\nDemo accounts:');
  console.log('- admin / password');
  console.log('- user / 123456');
  console.log('- demo / demo');
  console.log('\nUsing express-jwt v0.1.3 for JWT authentication');
});