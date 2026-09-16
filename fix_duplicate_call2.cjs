const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

const regex = /    setShowRandomMatch\(true\);\n\n    let socket = getSocket\(\);\n    if \(!socket\) \{\n      socket = await initSocket\(\);\n    \}\n    \n    if \(socket\) \{\n      socket\.emit\('initiate_call', \{\n        targetId: creator\.id,\n        type,\n        rate: requiredCoins\n      \}\);\n\n      clearCallTimeout\(\);\n      callTimeoutRef\.current = setTimeout\(\(\) => \{\n        setShowRandomMatch\(false\);\n        showToast\('User is not available right now\.'\);\n      \}, 35000\);\n    \}\n  \};\n\n  const handleCall = \(creator: CreatorItem\) => \{/;

const newBlock = `    setShowRandomMatch(true);
  };

  const handleCall = (creator: CreatorItem) => {`;

if (content.match(regex)) {
  content = content.replace(regex, newBlock);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("REGEX NOT MATCHED");
}
