const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Revert handleRandom
const oldRandom = `  const handleRandom = async () => {
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
const newRandom = `  const handleRandom = () => {
    setRandomMatchTarget(undefined);
    setRandomMatchType(Math.random() > 0.5 ? 'audio' : 'video');
    setShowRandomMatch(true);
  };`;
content = content.replace(oldRandom, newRandom);

// 2. Remove DND block modal JSX from HomeScreen
content = content.replace(/\{\/\* DND Block Modal \*\/\}[\s\S]*?(?=\{\/\* Floating Random Button \*\/)/m, '');

// 3. Remove showDndBlockModal and pendingCall state
content = content.replace(`  const [showDndBlockModal, setShowDndBlockModal] = useState(false);\n`, '');
content = content.replace(`  const [pendingCall, setPendingCall] = useState<{creator: CreatorItem, type: 'audio'|'video'} | null>(null);\n`, '');

// 4. Refactor initiateCallWithChecks -> it only OPENS the modal now
// And create executeSocketCall that actually sends the socket event
const oldInit = `  const initiateCallWithChecks = async (creator: CreatorItem, type: 'audio' | 'video') => {
        setPendingCall({ creator, type });
      const rate = type === 'audio' ? creator.callRate : creator.videoRate;
      const requiredCoins = rate || (type === 'audio' ? 20 : 40);
  
      if (coinBalance < requiredCoins) {
        navigation.navigate('Wallet', { 
          showWarning: 'insufficient_coins',
          requiredCoins,
          callType: type
        } as any);
        return;
      }
  
      setRandomMatchTarget(creator);
      setRandomMatchType(type);
      // Keep refs in sync so socket handlers never see stale closures
      randomMatchTargetRef.current = creator;
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

const newInit = `  const executeSocketCall = async () => {
    const creator = randomMatchTargetRef.current;
    const type = randomMatchTypeRef.current;
    if (!creator) return;

    const rate = type === 'audio' ? creator.callRate : creator.videoRate;
    const requiredCoins = rate || (type === 'audio' ? 20 : 40);

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
  };

  const initiateCallWithChecks = async (creator: CreatorItem, type: 'audio' | 'video') => {
    const rate = type === 'audio' ? creator.callRate : creator.videoRate;
    const requiredCoins = rate || (type === 'audio' ? 20 : 40);

    if (coinBalance < requiredCoins) {
      navigation.navigate('Wallet', { 
        showWarning: 'insufficient_coins',
        requiredCoins,
        callType: type
      } as any);
      return;
    }

    setRandomMatchTarget(creator);
    setRandomMatchType(type);
    randomMatchTargetRef.current = creator;
    randomMatchTypeRef.current = type;
    
    // Open modal. Modal will check DND, then call onProceedWithDirectCall if all good.
    setShowRandomMatch(true);
  };`;

content = content.replace(oldInit, newInit);

// 5. Update RandomMatchModal JSX in HomeScreen to pass onProceedWithDirectCall
const oldModal = `<RandomMatchModal
        visible={showRandomMatch}
        onClose={() => {
          setShowRandomMatch(false);
          const socket = getSocket();
          if (socket) socket.emit('cancel_call', { targetId: randomMatchTarget?.id });
        }}
        mode={randomMatchType}
        targetUser={randomMatchTarget}
        onMatchFound={(creator) => {
          // Construct a partial CreatorItem for the checks
          const mockCreator = {
            id: creator.id,
            name: creator.name,
            avatarUri: creator.avatarUri,
            callAvailable: true,
            videoAvailable: true,
            callRate: 20,
            videoRate: 40,
          } as any;
          initiateCallWithChecks(mockCreator, randomMatchType);
        }}
      />`;

const newModal = `<RandomMatchModal
        visible={showRandomMatch}
        onClose={() => {
          setShowRandomMatch(false);
          const socket = getSocket();
          if (socket) socket.emit('cancel_call', { targetId: randomMatchTarget?.id });
        }}
        mode={randomMatchType}
        targetUser={randomMatchTarget}
        onProceedWithDirectCall={executeSocketCall}
        onMatchFound={(creator) => {
          // Construct a partial CreatorItem for the checks
          const mockCreator = {
            id: creator.id,
            name: creator.name,
            avatarUri: creator.avatarUri,
            callAvailable: true,
            videoAvailable: true,
            callRate: 20,
            videoRate: 40,
          } as any;
          initiateCallWithChecks(mockCreator, randomMatchType);
        }}
      />`;

content = content.replace(oldModal, newModal);

fs.writeFileSync(file, content);
console.log("HomeScreen updated to delegate socket call to RandomMatchModal!");
