const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update the dependency array
content = content.replace(
  /\}, \[activeTab\]\);/g,
  `}, [activeTab, refreshToggle]);`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
