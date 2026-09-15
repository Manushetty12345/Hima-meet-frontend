const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove socket listener for call_blocked_dnd
content = content.replace(
  `        const handleCallBlockedDnd = () => {
          setRandomMatchTarget(undefined);
          setShowDndBlockModal(true);
        };
        socket.off('call_blocked_dnd').on('call_blocked_dnd', handleCallBlockedDnd);`,
  ``
);
content = content.replace(`        socket.off('call_blocked_dnd');\n`, ``);

// 2. Update initiateCallWithChecks to check API first
const oldInit = `  const initiateCallWithChecks = async (creator: CreatorItem, type: 'audio' | 'video') => {
      setPendingCall({ creator, type });
      const rate = type === 'audio' ? creator.callRate : creator.videoRate;`;

const newInit = `  const initiateCallWithChecks = async (creator: CreatorItem, type: 'audio' | 'video') => {
      // Check DND First
      try {
        const profileRes = await apiClient.get('/api/user/me');
        if (profileRes.data?.data?.dnd_enabled) {
          setPendingCall({ creator, type });
          setShowDndBlockModal(true);
          return;
        }
      } catch (e) {
        // ignore and proceed
      }

      setPendingCall({ creator, type });
      const rate = type === 'audio' ? creator.callRate : creator.videoRate;`;

content = content.replace(oldInit, newInit);

// 3. Update handleRandom to check API first
const oldRandom = `  const handleRandom = () => {
    setRandomMatchTarget(undefined);
    setRandomMatchType(Math.random() > 0.5 ? 'audio' : 'video');
    setShowRandomMatch(true);
  };`;

const newRandom = `  const handleRandom = async () => {
    try {
      const profileRes = await apiClient.get('/api/user/me');
      if (profileRes.data?.data?.dnd_enabled) {
        setPendingCall({ creator: {} as any, type: Math.random() > 0.5 ? 'audio' : 'video' });
        setShowDndBlockModal(true);
        return;
      }
    } catch (e) {
      // ignore
    }
    setRandomMatchTarget(undefined);
    setRandomMatchType(Math.random() > 0.5 ? 'audio' : 'video');
    setShowRandomMatch(true);
  };`;

content = content.replace(oldRandom, newRandom);

fs.writeFileSync(file, content);
console.log("HomeScreen updated with pre-call DND checks!");
