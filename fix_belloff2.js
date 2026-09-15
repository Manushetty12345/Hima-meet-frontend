const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the multi-line lucide import to add BellOff
content = content.replace(
  `  Shuffle, X,
} from 'lucide-react-native'`,
  `  Shuffle, X, BellOff,
} from 'lucide-react-native'`
);

fs.writeFileSync(file, content);
console.log("BellOff added to import!");
