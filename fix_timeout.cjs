const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

const regex = /    if \(!socket\) socket = await initSocket\(\);\n    if \(socket\) \{\n      socket\.emit\('initiate_call', \{ targetId: creator\.id, type, rate: requiredCoins \}\);\n    \}\n  \};/;

const newBlock = `    if (!socket) socket = await initSocket();
    if (socket) {
      socket.emit('initiate_call', { targetId: creator.id, type, rate: requiredCoins });

      clearCallTimeout();
      callTimeoutRef.current = setTimeout(() => {
        setShowRandomMatch(false);
        showToast('User is not available right now.');
      }, 35000);
    }
  };`;

if (content.match(regex)) {
  content = content.replace(regex, newBlock);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("REGEX NOT MATCHED");
}
