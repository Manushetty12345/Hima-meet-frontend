const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add local state
content = content.replace(
  /const \[isOnline, setIsOnline\] = useState\(creator\?\.isOnline \|\| false\);/,
  `const [isOnline, setIsOnline] = useState(creator?.isOnline || false);\n  const [callAvailable, setCallAvailable] = useState(creator?.callAvailable !== false);\n  const [videoAvailable, setVideoAvailable] = useState(creator?.videoAvailable !== false);`
);

// 2. Add socket listener for availability_changed
const listenerStr = `
            localSocket.on('availability_changed', (data: any) => {
              if (data.userId?.toString() === creator.id?.toString()) {
                if (data.call_type === 'voice') setCallAvailable(data.is_online);
                if (data.call_type === 'video') setVideoAvailable(data.is_online);
              }
            });
            localSocket.on('user_offline',`;

content = content.replace(
  /localSocket\.on\('user_offline',/,
  listenerStr
);

// 3. Replace creator.callAvailable with local state callAvailable
content = content.replace(/creator\.callAvailable/g, 'callAvailable');
content = content.replace(/creator\.videoAvailable/g, 'videoAvailable');

fs.writeFileSync(file, content);
console.log("SUCCESS");
