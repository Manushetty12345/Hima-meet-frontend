const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("Image } from 'react-native'")) {
  content = content.replace("Alert } from 'react-native';", "Alert, Image } from 'react-native';");
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("ALREADY EXISTS");
}
