const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/support/screens/MyTicketsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /Alert,\n} from 'react-native';/g;
if (content.match(regex)) {
  content = content.replace(regex, "Alert,\n  RefreshControl,\n} from 'react-native';");
} else {
  // Try another pattern
  const regex2 = /ActivityIndicator,\n\s*Alert\s*}\s*from\s*'react-native';/g;
  content = content.replace(regex2, "ActivityIndicator,\n  Alert,\n  RefreshControl\n} from 'react-native';");
}

fs.writeFileSync(file, content);
console.log("Fixed RefreshControl import");
