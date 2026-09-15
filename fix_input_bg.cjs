const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change chatInputWrapper to be transparent/translucent and remove harsh shadows
content = content.replace(
  /chatInputWrapper: \{([\s\S]*?)backgroundColor: '#FFFFFF',([\s\S]*?)shadowColor: '#000',([\s\S]*?)shadowOpacity: 0\.04,([\s\S]*?)elevation: 2,\s*\}/,
  `chatInputWrapper: {$1backgroundColor: 'rgba(255, 255, 255, 0.4)',$2shadowColor: 'transparent',$3shadowOpacity: 0,$4elevation: 0,\n      borderWidth: 1,\n      borderColor: 'rgba(255, 255, 255, 0.6)',\n    }`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
