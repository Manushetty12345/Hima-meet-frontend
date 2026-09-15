const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `      const handleCallBlockedDnd = () => {
        setRandomMatchTarget(undefined);
        setShowDndBlockModal(true);
      };
      socket.off('call_blocked_dnd').on('call_blocked_dnd', handleCallBlockedDnd);`;
content = content.replace(target1, '');

const target2 = `  const initiateCallWithChecks = async (creator: CreatorItem, type: 'audio' | 'video') => {
      setPendingCall({ creator, type });
    const rate = type === 'audio' ? creator.callRate : creator.videoRate;`;
const rep2 = `  const executeSocketCall = async () => {
    const creator = randomMatchTargetRef.current;
    const type = randomMatchTypeRef.current;
    if (!creator) return;
    const rate = type === 'audio' ? creator.callRate : creator.videoRate;
    const requiredCoins = rate || (type === 'audio' ? 20 : 40);
    let socket = getSocket();
    if (!socket) socket = await initSocket();
    if (socket) {
      socket.emit('initiate_call', { targetId: creator.id, type, rate: requiredCoins });
    }
  };

  const initiateCallWithChecks = async (creator: CreatorItem, type: 'audio' | 'video') => {
    const rate = type === 'audio' ? creator.callRate : creator.videoRate;`;
content = content.replace(target2, rep2);

const target3 = `    randomMatchTargetRef.current = creator;
    randomMatchTypeRef.current = type;
    setShowRandomMatch(true);

    let socket = getSocket();
    if (!socket) {
      socket = await initSocket();
    }
    
    if (socket) {
      socket.emit('initiate_call', {
        targetId: creator.id,
        type,
        rate: requiredCoins
      });
    }
  };`;
const rep3 = `    randomMatchTargetRef.current = creator;
    randomMatchTypeRef.current = type;
    setShowRandomMatch(true);
  };`;
content = content.replace(target3, rep3);

fs.writeFileSync(file, content);
console.log("HomeScreen DND logic replaced!");
