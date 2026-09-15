const fs = require('fs');
const file = 'src/modules/home/components/RandomMatchModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `      if (targetUser) {
        // Direct call, no roaming
        setDisplayAvatar(targetUser.avatarUri);
        setStatusText('Request Sent');
      } else {
        // Random Match Mode - Roaming Animation & API Call
        runRandomMatchLogic();
      }`;

const rep = `      // Check DND before proceeding
      apiClient.get('/api/user/me').then(res => {
        if (res.data?.data?.dnd_enabled) {
          setShowDndBlock(true);
          return; // Wait for user to turn it off
        }
        proceedWithCall();
      }).catch(() => {
        proceedWithCall(); // fallback
      });`;

if (content.includes(target)) {
  content = content.replace(target, rep);
  fs.writeFileSync(file, content);
  console.log("Successfully replaced the block!");
} else {
  console.log("Failed to find the target block in RandomMatchModal.tsx.");
}
