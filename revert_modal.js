const fs = require('fs');
const file = 'src/modules/home/components/RandomMatchModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Strip out the DND check
content = content.replace(
  `      // Check DND first
      apiClient.get('/api/user/me').then(res => {
        if (res.data?.data?.dnd_enabled) {
          setShowDndBlock(true);
          return;
        }
        if (targetUser) {
          setDisplayAvatar(targetUser.avatarUri);
          setStatusText('Request Sent');
        } else {
          runRandomMatchLogic();
        }
      }).catch(() => {
        // If check fails, proceed normally
        if (targetUser) {
          setDisplayAvatar(targetUser.avatarUri);
          setStatusText('Request Sent');
        } else {
          runRandomMatchLogic();
        }
      });`,
  `      if (targetUser) {
        // Direct call, no roaming
        setDisplayAvatar(targetUser.avatarUri);
        setStatusText('Request Sent');
      } else {
        // Random Match Mode - Roaming Animation & API Call
        runRandomMatchLogic();
      }`
);

// Strip out the showDndBlock state
content = content.replace(`  const [showDndBlock, setShowDndBlock] = useState(false);\n`, ``);
content = content.replace(`      setShowDndBlock(false);\n`, ``);

// Remove the DND Block Overlay JSX
content = content.replace(/\{\/\* DND Block Overlay - shown inside the modal \*\/\}[\s\S]*\{\/\* Footer \*\/\}/m, `{/* Footer */}`);

fs.writeFileSync(file, content);
console.log("RandomMatchModal reverted!");
