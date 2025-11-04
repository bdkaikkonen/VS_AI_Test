// Simple Node.js Hello World Web Server
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  
  const parsedUrl = url.parse(req.url, true);
  const name = parsedUrl.query.name || '';
  
  let greeting = 'Hello, World!';
  if (name.trim()) {
    greeting = `Hello, ${name.trim()}!`;
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Hello World - Node.js Server</title>
        <style>
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
            input[type="text"] {
                padding: 10px;
                font-size: 16px;
                border: 2px solid #ddd;
                border-radius: 5px;
                width: 200px;
                margin-right: 10px;
            }
            button {
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #0056b3;
            }
            .greeting {
                font-size: 24px;
                color: #28a745;
                margin: 20px 0;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Personalized Hello World</h1>
            
            <div class="greeting">${greeting}</div>
            
            <form method="GET" action="/">
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
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log('Press Ctrl+C to stop the server');
});