const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/profile/screens/PrivacyPolicyScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('himaapp@gmail.com', 'info@hashtocolon.com');

fs.writeFileSync(file, content);
console.log("Updated PrivacyPolicyScreen with correct email");
