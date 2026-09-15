const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /showToast\(error\.response\?\.data\?\.message \|\| 'Failed to send friend request'\);/g,
  "showToast((error as any).response?.data?.message || 'Failed to send friend request');"
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
