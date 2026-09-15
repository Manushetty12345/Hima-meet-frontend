const fs = require('fs');
const file = 'src/modules/onboarding/screens/NotificationSetupScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `import messaging from '@react-native-firebase/messaging';`,
  `// @ts-ignore - Firebase types sometimes don't resolve the default export correctly
import messaging from '@react-native-firebase/messaging';`
);

fs.writeFileSync(file, content);
console.log("TS ignore added!");
