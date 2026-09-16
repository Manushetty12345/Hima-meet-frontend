const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        searchFiles(fullPath);
      } else {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('call_incoming') || content.includes('cancel_incoming_call') || content.includes('IncomingCall')) {
          console.log(`Found in: ${fullPath}`);
        }
      }
    }
  } catch (e) {}
}

searchFiles('d:/App6/hima-meet-frontend/src');
