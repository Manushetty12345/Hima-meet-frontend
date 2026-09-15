const fs = require('fs');
const files = [
  'src/modules/profile/screens/CommunityGuidelinesScreen.tsx',
  'src/modules/profile\screens/PrivacyPolicyScreen.tsx',
  'src/modules/profile/screens/RefundPolicyScreen.tsx',
  'src/modules/profile/screens/TermsScreen.tsx'
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Innovfix Private Limited/gi, 'HashToColon Systems Private Limited');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } catch (err) {
    console.error(`Error updating ${file}:`, err.message);
  }
});
