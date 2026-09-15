const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/BlockUserModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/#FF1493/g, '#5B0E8B');
content = content.replace(/\s*marginTop: -48,.*$/m, '');

fs.writeFileSync(file, content);
console.log("SUCCESS");
