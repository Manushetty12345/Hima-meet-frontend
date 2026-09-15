const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Revert handleRandom back to simple version - DND check is now inside RandomMatchModal
const oldHandleRandom = `  const handleRandom = async () => {
    // Check if user has DND on before allowing random match
    try {
      const profileRes = await apiClient.get('/api/user/me');
      const profile = profileRes.data?.data;
      if (profile?.dnd_enabled) {
        // Store the pending call type for "Turn off & call" button
        const type = Math.random() > 0.5 ? 'audio' : 'video';
        setPendingCall({ creator: {} as any, type });
        setShowDndBlockModal(true);
        return;
      }
    } catch (e) {
      // If check fails, still allow the call
    }
    setRandomMatchTarget(undefined);
    setRandomMatchType(Math.random() > 0.5 ? 'audio' : 'video');
    setShowRandomMatch(true);
  };`;

const newHandleRandom = `  const handleRandom = () => {
    setRandomMatchTarget(undefined);
    setRandomMatchType(Math.random() > 0.5 ? 'audio' : 'video');
    setShowRandomMatch(true);
  };`;

if (content.includes(oldHandleRandom)) {
  content = content.replace(oldHandleRandom, newHandleRandom);
  fs.writeFileSync(file, content);
  console.log("handleRandom reverted to simple version!");
} else {
  console.log("Target not found - manual check needed");
}
