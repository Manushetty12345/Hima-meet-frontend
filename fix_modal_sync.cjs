const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /  \/\/ Fetch status/;

const newBlock = `  // Sync state when creator prop changes
  useEffect(() => {
    if (creator) {
      setIsOnline(creator.isOnline || false);
      setCallAvailable(creator.callAvailable !== false);
      setVideoAvailable(creator.videoAvailable !== false);
      setLastSeen((creator as any).lastSeen || null);
    }
  }, [creator]);

  // Fetch status`;

content = content.replace(regex, newBlock);

fs.writeFileSync(file, content);
console.log("SUCCESS");
