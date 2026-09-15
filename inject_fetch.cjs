const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject the fetch call to our local server
content = content.replace(
  /if \(res\?\.data\?\.status === 'success'\) \{[\s]*console\.log\("FRIENDS API RESPONSE:", JSON\.stringify\(res\.data\.data\.slice\(0, 2\)\)\);/g,
  `if (res?.data?.status === 'success') { fetch('http://127.0.0.1:9999/', { method: 'POST', body: JSON.stringify(res.data.data) }).catch(e=>console.log(e));`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
