const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /toastContainer: \{\r?\n\s*position: 'absolute',\r?\n\s*bottom: 90,/,
  `toastContainer: {\n      position: 'absolute',\n      bottom: 120,`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
