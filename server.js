const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 2021;
// Xác định MIME types cho các loại file
const mimeTypes = {
 '.html': 'text/html',
 '.css': 'text/css',
 '.js': 'application/javascript',
 '.json': 'application/json',
 '.png': 'image/png',
 '.jpg': 'image/jpeg',
 '.jpeg': 'image/jpeg',
 '.gif': 'image/gif',
 '.svg': 'image/svg+xml',
 '.ico': 'image/x-icon',
};
const server = http.createServer((req, res) => {
 let filePath = req.url === '/' ? '/index.html' : req.url;
 //kết hợp __dirname với filePath để tạo ra một đường dẫn tuyệt đối
 filePath = path.join(__dirname, filePath);
 // lấy phần mở rộng(extension) của một đường dẫn file
 const extname = path.extname(filePath);
 const contentType = mimeTypes[extname] || 'application/octet-stream';
 fs.readFile(filePath, (err, content) => {
   if (err) {
     res.writeHead(404, { 'Content-Type': 'text/plain' });
     res.end('404 - File not found');
   } else {
     res.writeHead(200, { 'Content-Type': contentType });
     res.end(content);
   }
 });
});
server.listen(PORT, () => {
 console.log(`Server running at http://localhost:${PORT}`);
});