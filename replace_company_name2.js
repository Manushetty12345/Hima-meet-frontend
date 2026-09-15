const fs = require('fs');
const file = 'src/modules/profile/screens/PrivacyPolicyScreen.tsx';

try {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/Innovfix Private Limited/gi, 'HashToColon Systems Private Limited');
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
} catch (err) {
  console.error(`Error updating ${file}:`, err.message);
}
