const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change rate text color to black/dark
content = content.replace(
  /color: GOLD_DEEP,/,
  `color: '#1A1A2E',`
);

// Make the back button smaller
content = content.replace(
  /<ArrowLeft size=\{20\}/,
  `<ArrowLeft size={16}`
);

content = content.replace(
  /backBtn: \{\s*width: 42,\s*height: 42,\s*borderRadius: 12,/,
  `backBtn: {\n      width: 32,\n      height: 32,\n      borderRadius: 10,`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
