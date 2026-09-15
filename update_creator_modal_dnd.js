const fs = require('fs');
const file = 'src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove socket listener for call_blocked_dnd
content = content.replace(
  `            localSocket.on('call_blocked_dnd', () => {
              setShowDndBlockModal(true);
            });`,
  ``
);
content = content.replace(`        localSocket.off('call_blocked_dnd');\n`, ``);

// 2. Update initiateCall
const oldInit = `  const initiateCall = (type: 'audio' | 'video') => {
    setPendingCallType(type);
    const rate = type === 'audio' ? creator.callRate : creator.videoRate;`;

const newInit = `  const initiateCall = async (type: 'audio' | 'video') => {
    try {
      const profileRes = await apiClient.get('/api/user/me');
      if (profileRes.data?.data?.dnd_enabled) {
        setPendingCallType(type);
        setShowDndBlockModal(true);
        return;
      }
    } catch (e) {}

    setPendingCallType(type);
    const rate = type === 'audio' ? creator.callRate : creator.videoRate;`;

content = content.replace(oldInit, newInit);

fs.writeFileSync(file, content);
console.log("CreatorProfileModal updated with pre-call DND checks!");
