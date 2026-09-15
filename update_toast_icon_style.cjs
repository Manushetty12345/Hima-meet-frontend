const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /toastIcon: \{\s*width: 24,\s*height: 24,\s*marginRight: 10,\s*resizeMode: 'contain',\s*\}/,
  `toastIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  }`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
