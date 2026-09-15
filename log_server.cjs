const http = require('http');
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    console.log("RECEIVED PAYLOAD:", body);
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end('OK');
    process.exit(0); // Exit after receiving one payload
  });
});
server.listen(9999, () => {
  console.log("Listening on 9999...");
});
