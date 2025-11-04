// Simple Node.js Hello World Web Server with Login
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

// Simple in-memory session storage (for demo purposes)
const sessions = new Map();
const users = new Map([
  ['admin', 'password'],
  ['user', '123456'],
  ['demo', 'demo']
]);

// Generate simple session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Check if user is logged in
function isLoggedIn(req) {
  const parsedUrl = url.parse(req.url, true);
  const sessionId = parsedUrl.query.session;
  return sessionId && sessions.has(sessionId);
}

// Get username from session
function getUsername(req) {
  const parsedUrl = url.parse(req.url, true);
  const sessionId = parsedUrl.query.session;
  return sessions.get(sessionId);
}

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
`;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  // Handle POST requests (for login form)
  if (req.method === 'POST' && pathname === '/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const formData = querystring.parse(body);
      const username = formData.username;
      const password = formData.password;
      
      if (users.has(username) && users.get(username) === password) {
        const sessionId = generateSessionId();
        sessions.set(sessionId, username);
        res.writeHead(302, { 'Location': `/?session=${sessionId}` });
        res.end();
      } else {
        const loginHtml = getLoginPage('Invalid username or password');
        res.end(loginHtml);
      }
    });
    return;
  }
  
  // Handle logout
  if (pathname === '/logout') {
    const sessionId = query.session;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.writeHead(302, { 'Location': '/login' });
    res.end();
    return;
  }
  
  // Check if user is logged in for protected routes
  if (pathname === '/' || pathname === '/hello') {
    if (!isLoggedIn(req)) {
      res.writeHead(302, { 'Location': '/login' });
      res.end();
      return;
    }
    
    const username = getUsername(req);
    const name = query.name || username;
    const sessionId = query.session;
    
    let greeting = `Hello, ${name}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Hello World - Node.js Server</title>
          <style>${commonStyles}</style>
      </head>
      <body>
          <div class="container">
              <div class="nav">
                  <p>Welcome, <strong>${username}</strong>!</p>
                  <a href="/logout?session=${sessionId}">
                      <button class="logout-btn">Logout</button>
                  </a>
              </div>
              
              <h1>Personalized Hello World</h1>
              
              <div class="greeting">${greeting}</div>
              
              <form method="GET" action="/">
                  <input type="hidden" name="session" value="${sessionId}" />
                  <div class="form-group">
                      <input type="text" name="name" placeholder="Enter your name" value="${name}" />
                      <button type="submit">Say Hello</button>
                  </div>
              </form>
              
              <p>Welcome to your Node.js web server!</p>
              <p>Current time: ${new Date().toISOString()}</p>
              <p>Server is running on port ${port}</p>
          </div>
      </body>
      </html>
    `;
    
    res.end(html);
    return;
  }
  
  // Default to login page
  const loginHtml = getLoginPage();
  res.end(loginHtml);
});

function getLoginPage(errorMessage = '') {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login - Node.js Server</title>
        <style>${commonStyles}</style>
    </head>
    <body>
        <div class="container">
            <h1>Login</h1>
            
            ${errorMessage ? `<div class="error">${errorMessage}</div>` : ''}
            
            <form method="POST" action="/login">
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
            
            <p>Current time: ${new Date().toISOString()}</p>
        </div>
    </body>
    </html>
  `;
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log('Press Ctrl+C to stop the server');
  console.log('\nDemo accounts:');
  console.log('- admin / password');
  console.log('- user / 123456');
  console.log('- demo / demo');
});