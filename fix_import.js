const fs = require('fs');
const file = 'src/modules/wallet/screens/WalletScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `import AsyncStorage from '@react-native-async-storage/async-storage';`,
  `import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSocket } from '../../../api/socketClient';`
);

fs.writeFileSync(file, content);
console.log("Import added!");
