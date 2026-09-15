const fs = require('fs');
const file = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/ad8fde9e-a933-4168-aba7-edc37a3bc6fc/task.md';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/- \[ \]/g, '- [x]');
fs.writeFileSync(file, content);
console.log("Tasks marked as complete");
