const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const handleInsufficientCoins = \(\) => \{[\s\S]*?\} as any\);\n\s*\};/;
const replacementStr = `const handleInsufficientCoins = (data?: { requiredCoins?: number }) => {
          clearCallTimeout();
          setShowRandomMatch(false);
          const type = randomMatchTypeRef.current;
          const creator = randomMatchTargetRef.current;
          const rate = type === 'audio' ? creator?.callRate : creator?.videoRate;
          const requiredCoins = data?.requiredCoins || rate || (type === 'audio' ? 20 : 40);
          navigation.navigate('Wallet', { 
            showWarning: 'insufficient_coins',
            requiredCoins,
            callType: type
          } as any);
        };`;

content = content.replace(regex, replacementStr);
fs.writeFileSync(file, content);
console.log("SUCCESS frontend replace");
