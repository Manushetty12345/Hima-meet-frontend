const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import if not exists
if (!content.includes("import apiClient")) {
  content = content.replace("import { Phone, Video, Pin, Bell, BellOff } from 'lucide-react-native';", "import { Phone, Video, Pin, Bell, BellOff } from 'lucide-react-native';\nimport apiClient from '../../../api/apiClient';");
}

// Replace toggleMute
const toggleRegex = /const toggleMute = \(\) => \{[\s\S]*?\};\n/;
const newToggle = `const toggleMute = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // isMuted means notifications are OFF. So if newMutedState is false, enabled is true.
    const enableNotifications = !newMutedState;

    try {
      await apiClient.post(\`/api/creator/\${item.id}/notify-online\`, { enabled: enableNotifications });
    } catch (err) {
      console.error('Failed to toggle notification', err);
    }

    if (newMutedState) {
      onShowToast(\`Notifications off for \${item.name}\`);
    } else {
      onShowToast(\`You will be notified when \${item.name} comes online\`, 'info');
    }
  };\n`;

content = content.replace(toggleRegex, newToggle);

fs.writeFileSync(file, content);
console.log("SUCCESS");
