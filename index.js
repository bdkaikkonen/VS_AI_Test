// Simple Node.js Hello World Web Server
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  
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
            }
            h1 { color: #333; }
            p { color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello, World!</h1>
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