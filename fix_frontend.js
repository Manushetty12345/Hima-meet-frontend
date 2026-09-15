const fs = require('fs');
const file = 'src/modules/onboarding/screens/ProfileReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `import AsyncStorage from '@react-native-async-storage/async-storage';`;
const newStr = `import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../../api/apiClient';`;

content = content.replace(targetStr, newStr);

const targetStr2 = `await AsyncStorage.setItem('userToken', response.data.data.token);`;
const newStr2 = `await AsyncStorage.setItem('userToken', response.data.data.token);
              await setAuthToken(response.data.data.token);`;

content = content.replace(targetStr2, newStr2);
fs.writeFileSync(file, content);
console.log("Successfully replaced!");
