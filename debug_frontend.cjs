const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject console.log for debugging the API response
content = content.replace(
  /if \(res\?\.data\?\.status === 'success'\) \{/,
  `if (res?.data?.status === 'success') { console.log("FRIENDS API RESPONSE:", JSON.stringify(res.data.data.slice(0, 2)));`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
