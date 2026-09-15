const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/profile/screens/PrivacyPolicyScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const index = content.indexOf('addressTitle');
if (index !== -1) {
  console.log(content.substring(index - 500, index + 500));
} else {
  console.log("Not found!");
}
