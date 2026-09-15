const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const newListeners = `
      socket.off('friend_update').on('friend_update', () => {
        fetchData();
      });

      socket.off('availability_changed').on('availability_changed', (payload: any) => {
        setData(prevData => {
          const newData = { ...prevData };
          (Object.keys(newData) as TabKey[]).forEach(tab => {
            newData[tab] = newData[tab].map(item => {
              if (item.id === payload.userId?.toString()) {
                return {
                  ...item,
                  callAvailable: payload.call_type === 'voice' ? payload.is_online : item.callAvailable,
                  videoAvailable: payload.call_type === 'video' ? payload.is_online : item.videoAvailable
                };
              }
              return item;
            });
          });
          return newData;
        });
      });

      socket.off('user_online').on('user_online', (payload: any) => {
        setData(prevData => {
          const newData = { ...prevData };
          (Object.keys(newData) as TabKey[]).forEach(tab => {
            newData[tab] = newData[tab].map(item => {
              if (item.id === payload.userId?.toString()) return { ...item, isOnline: true, online: true };
              return item;
            });
          });
          return newData;
        });
      });

      socket.off('user_offline').on('user_offline', (payload: any) => {
        setData(prevData => {
          const newData = { ...prevData };
          (Object.keys(newData) as TabKey[]).forEach(tab => {
            newData[tab] = newData[tab].map(item => {
              if (item.id === payload.userId?.toString()) return { ...item, isOnline: false, online: false };
              return item;
            });
          });
          return newData;
        });
      });
`;

const cleanupListeners = `
      if (socket) {
        socket.off('friend_update');
        socket.off('availability_changed');
        socket.off('user_online');
        socket.off('user_offline');
      }
`;

content = content.replace(
  /socket\.off\('friend_update'\)\.on\('friend_update', \(\) => \{\n\s*console\.log\('\[WebSocket\] friend_update received - automatically refreshing Friends tab!'\);\n\s*fetchData\(\);\n\s*\}\);/,
  newListeners
);

// Fallback if console.log was modified
content = content.replace(
  /socket\.off\('friend_update'\)\.on\('friend_update', \(\) => \{\n\s*fetchData\(\);\n\s*\}\);/,
  newListeners
);

content = content.replace(
  /if \(socket\) \{\n\s*socket\.off\('friend_update', fetchData\);\n\s*\}/,
  cleanupListeners
);
// Fallback
content = content.replace(
  /if \(socket\) \{\n\s*socket\.off\('friend_update'\);\n\s*\}/,
  cleanupListeners
);


fs.writeFileSync(file, content);
console.log("SUCCESS");
