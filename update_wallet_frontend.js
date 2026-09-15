const fs = require('fs');
const file = 'src/modules/wallet/screens/WalletScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import for getSocket
content = content.replace(
  `import { formatCoins } from '../../../utils/currency';`,
  `import { formatCoins } from '../../../utils/currency';
import { getSocket } from '../../../api/socketClient';`
);

// 2. Add WebSocket listener in useEffect
const useEffectStr = `  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    fetchWalletData();
    checkPendingPayment();`;

const newUseEffectStr = `  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    fetchWalletData();
    checkPendingPayment();

    // Setup WebSocket listener for real-time wallet updates
    const socket = getSocket();
    if (socket) {
      socket.on('wallet_update', (data) => {
        console.log('Wallet updated via WebSocket:', data);
        fetchWalletData();
      });
    }

    return () => {
      if (socket) {
        socket.off('wallet_update');
      }
    };
  }, []); // Only run once on mount

  useEffect(() => { // Keep the animation stuff in its own effect if it was previously combined, actually let's just append carefully.`;

// Instead of replacing the whole block, let's just insert the socket listener inside the component.
