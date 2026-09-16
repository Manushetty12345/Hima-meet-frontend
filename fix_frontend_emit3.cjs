const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the handleInsufficientCoins function completely
const regex = /const handleInsufficientCoins = \(data\?: \{ requiredCoins\?: number \}\) => \{[\s\S]*?\} as any\);\n\s*\};/;
const replacementStr = `const handleInsufficientCoins = (data?: { requiredCoins?: number }) => {
          clearCallTimeout();
          setShowRandomMatch(false);
          const type = randomMatchTypeRef.current;
          const creator = randomMatchTargetRef.current;
          const rate = type === 'audio' ? creator?.callRate : creator?.videoRate;
          
          // STRICT PARSING: ALWAYS prefer data.requiredCoins if it exists.
          let finalCoins = (type === 'audio' ? 20 : 40);
          if (data && data.requiredCoins !== undefined) {
            finalCoins = data.requiredCoins;
          } else if (rate !== undefined) {
            finalCoins = rate;
          }
          
          navigation.navigate('Wallet', { 
            showWarning: 'insufficient_coins',
            requiredCoins: finalCoins,
            callType: type
          } as any);
        };`;

if (content.match(regex)) {
  content = content.replace(regex, replacementStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS frontend replace 2");
} else {
  console.log("Regex didn't match! Let's check current function");
}
