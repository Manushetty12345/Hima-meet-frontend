const fs = require('fs');
const files = [
  'src/modules/profile/screens/CommunityGuidelinesScreen.tsx',
  'src/modules/profile/screens/PrivacyPolicyScreen.tsx',
  'src/modules/profile/screens/RefundPolicyScreen.tsx',
  'src/modules/profile/screens/TermsScreen.tsx'
];

files.forEach(file => {
  try {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace email
    content = content.replace(/himaapp000@gmail\.com/g, 'info@hashtocolon.com');

    // Replace old address
    const oldAddressRegex = /Indiique Ascent.*?India\./gs;
    const newAddress = `No.745, 10th Main, 3rd Block, 3rd Stage Basaveshwara Nagar,{'\n'}                  Bangalore, Karnataka, India - 560079`;
    
    content = content.replace(oldAddressRegex, newAddress);

    fs.writeFileSync(file, content);
    console.log(`Updated contact info in ${file}`);
  } catch (err) {
    console.error(`Error updating ${file}:`, err.message);
  }
});
