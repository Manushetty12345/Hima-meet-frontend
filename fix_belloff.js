const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Check current lucide import
const match = content.match(/import \{[^}]+\} from 'lucide-react-native'/);
if (match) {
  console.log("Current import:", match[0]);
  
  if (!content.includes('BellOff')) {
    const newImport = match[0].replace(
      `} from 'lucide-react-native'`,
      `, BellOff } from 'lucide-react-native'`
    );
    content = content.replace(match[0], newImport);
    fs.writeFileSync(file, content);
    console.log("BellOff added!");
  } else {
    console.log("BellOff already there");
  }
} else {
  console.log("No lucide import found");
}
