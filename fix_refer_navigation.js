const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('Alert,')) {
  content = content.replace(
    `  Modal,\n} from 'react-native';`,
    `  Modal,\n  Alert,\n} from 'react-native';`
  );
}

content = content.replace(
  `{renderQuickAction('Refer', UserPlus, GOLD_DEEP, 'rgba(245, 197, 66, 0.16)', () => navigation.navigate('Refer'))}`,
  `{renderQuickAction('Refer', UserPlus, GOLD_DEEP, 'rgba(245, 197, 66, 0.16)', () => Alert.alert('Coming Soon', 'Referral sharing will be implemented in the next version!'))}`
);

fs.writeFileSync(file, content);
console.log("Updated ProfileScreen!");
