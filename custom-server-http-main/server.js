const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // 1. Basic Routing
  let url = req.url === '/' ? '/index.html' : req.url;
  if (!path.extname(url)) url += '.html';
  const filePath = path.join(__dirname, url);

  // 2. MIME type
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/html';

  // 3. Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end('Page Not Found');
    }

    if (contentType === 'text/html') {
      // 4. Inject Header and Footer
      const header = fs.readFileSync(path.join(__dirname, 'header.html'), 'utf8');
      const footer = fs.readFileSync(path.join(__dirname, 'footer.html'), 'utf8');
      
      let html = content.toString()
        .replace('<!-- HEADER_PLACEHOLDER -->', header)
        .replace('<!-- FOOTER_PLACEHOLDER -->', footer);
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
