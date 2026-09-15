const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /paddingTop: Platform\.OS === 'android' \? 36 : 46,/,
  "paddingTop: Platform.OS === 'android' ? 50 : 60,"
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
