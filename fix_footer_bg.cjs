const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change the chatFooterContainer background to solid white
content = content.replace(
  /chatFooterContainer: \{([\s\S]*?)backgroundColor: 'transparent',([\s\S]*?)borderTopColor: 'rgba\(235, 229, 242, 0\.4\)',/,
  `chatFooterContainer: {$1backgroundColor: '#FFFFFF',$2borderTopColor: '#EBE5F2',`
);

// 2. Change the text input wrapper to a solid light lavender pill so it's visible on the white footer
content = content.replace(
  /chatInputWrapper: \{([\s\S]*?)backgroundColor: 'rgba\(255, 255, 255, 0\.4\)',([\s\S]*?)shadowColor: 'transparent',([\s\S]*?)shadowOpacity: 0,([\s\S]*?)elevation: 0,\s*borderWidth: 1,\s*borderColor: 'rgba\(255, 255, 255, 0\.6\)',\s*\}/,
  `chatInputWrapper: {$1backgroundColor: '#F5F0FA',$2shadowColor: 'transparent',$3shadowOpacity: 0,$4elevation: 0,\n    }`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
