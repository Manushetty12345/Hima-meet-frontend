const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /fetchData\(\);\s*\}, \[activeTab\]\);/s;

const newStr = `fetchData();
    
    // WebSocket auto-refresh
    const socket = getSocket();
    if (socket) {
      socket.off('friend_update').on('friend_update', fetchData);
    }

    return () => {
      if (socket) {
        socket.off('friend_update', fetchData);
      }
    };
  }, [activeTab]);`;

if (regex.test(content)) {
  content = content.replace(regex, newStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED to match regex");
}
