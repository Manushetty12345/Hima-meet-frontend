const fs = require('fs');
const path = require('path');

function searchFiles(dir, keyword) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'node_modules' || file === '.git' || file === 'android' || file === 'ios') continue;
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        searchFiles(fullPath, keyword);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(keyword)) {
          console.log(`Found in: ${fullPath}`);
        }
      }
    }
  } catch (e) {}
}

searchFiles('d:/App6/hima-meet-frontend', 'call_incoming');
