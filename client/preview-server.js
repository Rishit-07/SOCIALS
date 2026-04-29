const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, 'build');
const port = Number(process.env.PORT || 3000);

const types = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
    let filePath = path.join(root, requestedPath);

    if (!filePath.startsWith(root)) {
      filePath = path.join(root, 'index.html');
    }

    fs.stat(filePath, (statError, stat) => {
      if (statError || !stat.isFile()) {
        filePath = path.join(root, 'index.html');
      }

      fs.readFile(filePath, (readError, data) => {
        if (readError) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        res.writeHead(200, {
          'Content-Type': types[path.extname(filePath)] || 'application/octet-stream',
        });
        res.end(data);
      });
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Preview server running at http://localhost:${port}`);
  });
