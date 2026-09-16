const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const handleInsufficientCoins = \(data\?: \{ requiredCoins\?: number \}\) => \{([\s\S]*?)\} as any\);\n\s*\};/;
const replacementStr = `const handleInsufficientCoins = (data?: { requiredCoins?: number }) => {
          console.log('?? handleInsufficientCoins triggered! payload:', data);
          clearCallTimeout();
          setShowRandomMatch(false);
          const type = randomMatchTypeRef.current;
          const creator = randomMatchTargetRef.current;
          const rate = type === 'audio' ? creator?.callRate : creator?.videoRate;
          
          console.log('?? type:', type, 'creator:', creator, 'rate:', rate);
          
          // STRICT PARSING: ALWAYS prefer data.requiredCoins if it exists.
          let finalCoins = (type === 'audio' ? 20 : 40);
          if (data && data.requiredCoins !== undefined) {
            console.log('?? Using data.requiredCoins from backend:', data.requiredCoins);
            finalCoins = data.requiredCoins;
          } else if (rate !== undefined) {
            console.log('?? Using creator rate:', rate);
            finalCoins = rate;
          } else {
            console.log('?? Falling back to default:', finalCoins);
          }
          
          console.log('?? finalCoins calculated:', finalCoins);
          
          navigation.navigate('Wallet', { 
            showWarning: 'insufficient_coins',
            requiredCoins: finalCoins,
            callType: type
          } as any);
        };`;

if (content.match(regex)) {
  content = content.replace(regex, replacementStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS frontend replace 4");
} else {
  console.log("Regex didn't match! Let's check current function");
}
