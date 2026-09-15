const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const newListeners = `socket.off('friend_update').on('friend_update', () => {
        console.log('?? [WebSocket] friend_update received - automatically refreshing Friends tab!');
        fetchData();
      });

      socket.off('availability_changed').on('availability_changed', (payload: any) => {
        setData(prevData => {
          const newData = { ...prevData };
          (Object.keys(newData) as Array<keyof typeof newData>).forEach(tab => {
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
          (Object.keys(newData) as Array<keyof typeof newData>).forEach(tab => {
            newData[tab] = newData[tab].map(item => {
              if (item.id === payload.userId?.toString()) return { ...item, isOnline: true };
              return item;
            });
          });
          return newData;
        });
      });

      socket.off('user_offline').on('user_offline', (payload: any) => {
        setData(prevData => {
          const newData = { ...prevData };
          (Object.keys(newData) as Array<keyof typeof newData>).forEach(tab => {
            newData[tab] = newData[tab].map(item => {
              if (item.id === payload.userId?.toString()) return { ...item, isOnline: false };
              return item;
            });
          });
          return newData;
        });
      });`;

content = content.replace(
  /socket\.off\('friend_update'\)\.on\('friend_update', \(\) => \{[\s\S]*?fetchData\(\);\n\s*\}\);/,
  newListeners
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
