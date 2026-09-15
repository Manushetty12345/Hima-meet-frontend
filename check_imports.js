const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find all lucide imports
const matches = [...content.matchAll(/import \{[^}]+\} from 'lucide-react-native'/g)];
matches.forEach((m, i) => console.log(`Import ${i}:`, m[0].substring(0, 100)));
