const fs = require('fs');
const file = 'src/modules/wallet/screens/WalletScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import for getSocket
content = content.replace(
  `import { formatCoins } from '../../../utils/currency';`,
  `import { formatCoins } from '../../../utils/currency';
import { getSocket } from '../../../api/socketClient';`
);

// 2. Add WebSocket listener inside the component body, just above checkPendingPayment
content = content.replace(
  `  const checkPendingPayment = async () => {`,
  `  // Setup WebSocket listener for real-time wallet updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    const handleWalletUpdate = (data: any) => {
      console.log('Wallet updated via WebSocket:', data);
      fetchWalletData(true); // Re-fetch balance
    };

    socket.on('wallet_update', handleWalletUpdate);

    return () => {
      socket.off('wallet_update', handleWalletUpdate);
    };
  }, [fetchWalletData]);

  const checkPendingPayment = async () => {`
);

// 3. Remove RefreshControl from ScrollView
content = content.replace(
  `            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => fetchWalletData(true)}
                colors={[GOLD_DEEP]}
                tintColor={GOLD_DEEP}
              />
            }`,
  `            // RefreshControl removed as requested (using WebSocket instead)
            showsVerticalScrollIndicator={false}`
);

fs.writeFileSync(file, content);
console.log("Frontend WalletScreen updated!");
