const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `console.log('?? [WebSocket] friend_update received - automatically refreshing Friends tab!');`;
const newStr = `console.log('?? [WebSocket] friend_update received - automatically refreshing Friends tab!');
        Alert.alert('Real-Time Update!', 'WebSocket friend_update received - automatically refreshing Friends tab!');`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  
  // Make sure Alert is imported
  if (!content.includes('Alert,')) {
    content = content.replace(`from 'react-native';`, `, Alert } from 'react-native';`);
    content = content.replace(`import { `, `import { Alert, `);
  }
  
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED to find console.log");
}
