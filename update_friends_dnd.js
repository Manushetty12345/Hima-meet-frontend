const fs = require('fs');
const file = 'src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove socket listener for call_blocked_dnd
content = content.replace(
  `      socket.off('call_blocked_dnd').on('call_blocked_dnd', () => {
        setShowDndBlockModal(true);
      });`,
  ``
);
content = content.replace(`          socket.off('call_blocked_dnd');\n`, ``);

// 2. Update initiateCallWithChecks
const oldInit = `  const initiateCallWithChecks = async (creator: any, type: 'audio' | 'video') => {
      setPendingCall({ creator, type });
    const rate = type === 'audio' ? creator.call_rate : creator.video_rate;`;

const newInit = `  const initiateCallWithChecks = async (creator: any, type: 'audio' | 'video') => {
    try {
      const profileRes = await apiClient.get('/api/user/me');
      if (profileRes.data?.data?.dnd_enabled) {
        setPendingCall({ creator, type });
        setShowDndBlockModal(true);
        return;
      }
    } catch (e) {}

    setPendingCall({ creator, type });
    const rate = type === 'audio' ? creator.call_rate : creator.video_rate;`;

content = content.replace(oldInit, newInit);

fs.writeFileSync(file, content);
console.log("FriendsScreen updated with pre-call DND checks!");
