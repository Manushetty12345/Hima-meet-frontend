const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the header closing tag
content = content.replace(
  /<\/View>(\s*)\{\/\* Dropdown Overlay \*\/\}/s,
  `</LinearGradient>$1{/* Dropdown Overlay */}`
);

// 2. Fix the dropdown menu closing tag back to View
content = content.replace(
  /<\/LinearGradient>(\s*)<ImageBackground/s,
  `</View>$1<ImageBackground`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
