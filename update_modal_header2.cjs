const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /borderBottomWidth: 1,\s*borderBottomColor: '#F0EAF6',/s,
  `borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 3,`
);

content = content.replace(
  /backgroundColor: '#F9EBF2',/,
  `backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
