const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /formatted\.sort\(\(a, b\) => \{/g,
  `formatted.sort((a: any, b: any) => {`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
