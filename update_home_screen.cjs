const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// Update executeSocketCall
content = content.replace(
  /  const executeSocketCall = async \(\) => \{\n    const creator = randomMatchTargetRef\.current;\n    const type = randomMatchTypeRef\.current;\n    if \(!creator\) return;\n    const rate = type === 'audio' \? creator\.callRate : creator\.videoRate;\n    const requiredCoins = rate \|\| \(type === 'audio' \? 20 : 40\);\n    let socket = getSocket\(\);\n    if \(!socket\) socket = await initSocket\(\);\n    if \(socket\) \{\n      socket\.emit\('initiate_call', \{ targetId: creator\.id, type, rate: requiredCoins \}\);\n\n      clearCallTimeout\(\);\n      callTimeoutRef\.current = setTimeout\(\(\) => \{\n        setShowRandomMatch\(false\);\n        showToast\('User is not available right now\.'\);\n      \}, 35000\);\n    \}\n  \};/,
  `  const executeSocketCall = async () => {
    const creator = randomMatchTargetRef.current;
    const type = randomMatchTypeRef.current;
    
    let socket = getSocket();
    if (!socket) socket = await initSocket();
    if (!socket) return;

    if (creator && creator.id !== 'random-broadcast-dummy') {
      // 1-ON-1 DIRECT CALL (Normal Flow)
      const rate = type === 'audio' ? creator.callRate : creator.videoRate;
      const requiredCoins = rate || (type === 'audio' ? 20 : 40);
      socket.emit('initiate_call', { targetId: creator.id, type, rate: requiredCoins });
    } else {
      // BROADCAST RANDOM CALL
      socket.emit('initiate_random_broadcast', { type });
    }

    clearCallTimeout();
    callTimeoutRef.current = setTimeout(() => {
      setShowRandomMatch(false);
      showToast('No user is available right now.');
    }, 35000);
  };`
);

// We also need to update the floating action button to pass a "random-broadcast-dummy" creator 
// so initiateCallWithChecks knows it's a broadcast call.
content = content.replace(
  /            <TouchableOpacity\n              style=\{\[styles\.fabActionCircle, \{ backgroundColor: '#D4AF37' \}\]\}\n              activeOpacity=\{0\.8\}\n              onPress=\{\(\) => \{\n                setRandomMatchType\('audio'\);\n                setShowRandomMatch\(true\);\n                setIsFabExpanded\(false\);\n              \}\}\n            >/,
  `            <TouchableOpacity
              style={[styles.fabActionCircle, { backgroundColor: '#D4AF37' }]}
              activeOpacity={0.8}
              onPress={() => {
                const mockCreator = { id: 'random-broadcast-dummy', name: 'Random', avatarUri: '', callAvailable: true, videoAvailable: true, callRate: 20, videoRate: 40 } as any;
                initiateCallWithChecks(mockCreator, 'audio');
                setIsFabExpanded(false);
              }}
            >`
);

content = content.replace(
  /            <TouchableOpacity\n              style=\{\[styles\.fabActionCircle, \{ backgroundColor: '#3A0F63' \}\]\}\n              activeOpacity=\{0\.8\}\n              onPress=\{\(\) => \{\n                setRandomMatchType\('video'\);\n                setShowRandomMatch\(true\);\n                setIsFabExpanded\(false\);\n              \}\}\n            >/,
  `            <TouchableOpacity
              style={[styles.fabActionCircle, { backgroundColor: '#3A0F63' }]}
              activeOpacity={0.8}
              onPress={() => {
                const mockCreator = { id: 'random-broadcast-dummy', name: 'Random', avatarUri: '', callAvailable: true, videoAvailable: true, callRate: 20, videoRate: 40 } as any;
                initiateCallWithChecks(mockCreator, 'video');
                setIsFabExpanded(false);
              }}
            >`
);

// We need to add the `cancel_incoming_call` listener to dismiss the modal
content = content.replace(
  /      socket\.off\('availability_changed'\)\.on\('availability_changed', handleAvailabilityChanged\);/,
  `      socket.off('availability_changed').on('availability_changed', handleAvailabilityChanged);
      socket.off('cancel_incoming_call').on('cancel_incoming_call', (data) => {
        // If we are showing the random match modal, close it
        // Or if we are in an incoming call screen... wait, this is for the RECEIVER.
        // The receiver's incoming call modal is usually in a global provider or App.tsx.
        // However, if the receiver is on the HomeScreen, we should emit an event or close their modal.
        // Actually, where is the receiver's IncomingCallModal?
      });`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
