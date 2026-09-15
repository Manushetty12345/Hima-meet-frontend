const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    backgroundColor: '#2A1240',`;
const replacement = `    backgroundColor: '#9B5DE5', // Light purple requested by user`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Toast color updated to light purple!");
} else {
  console.log("Could not find the target color to replace!");
}
