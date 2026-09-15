const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Revert chatFooterContainer back to transparent so the background color extends to the end
content = content.replace(
  /chatFooterContainer: \{([\s\S]*?)backgroundColor: '#FFFFFF',([\s\S]*?)borderTopColor: '#EBE5F2',/,
  `chatFooterContainer: {$1backgroundColor: 'transparent',$2borderTopColor: 'rgba(235, 229, 242, 0.4)',`
);

// Keep the text input a solid white pill so it looks like a nice input box over the purple background
content = content.replace(
  /chatInputWrapper: \{([\s\S]*?)backgroundColor: '#F5F0FA',([\s\S]*?)shadowColor: 'transparent',([\s\S]*?)shadowOpacity: 0,([\s\S]*?)elevation: 0,\s*\}/,
  `chatInputWrapper: {$1backgroundColor: '#FFFFFF',$2shadowColor: '#000',$3shadowOpacity: 0.04,$4elevation: 2,\n    }`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
