const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

const targetStr = `    setShowRandomMatch(true);

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

      clearCallTimeout();
      callTimeoutRef.current = setTimeout(() => {
        const currentSocket = getSocket();
        if (currentSocket) {
          currentSocket.emit('cancel_call', { targetId: creator.id });
        }
        setShowRandomMatch(false);
        showToast('No answer from user. Please try again later.');
      }, 30000);
    }
  };`;

// Wait, I didn't see the full end of the function! Let's just remove the socket emit part.
// The easiest way is to use regex with [\s\S]*? to capture everything between setShowRandomMatch and the end of the function.

