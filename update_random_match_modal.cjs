const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/components/RandomMatchModal.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\r\n/g, '\n');

// Update proceedWithCall
content = content.replace(
  /  const proceedWithCall = \(\) => \{\n    if \(targetUser\) \{\n      setDisplayAvatar\(targetUser\.avatarUri\);\n      setStatusText\('Request Sent'\);\n      if \(onProceedWithDirectCall\) onProceedWithDirectCall\(\);\n    \} else \{\n      runRandomMatchLogic\(\);\n    \}\n  \};/,
  `  const proceedWithCall = () => {
    if (targetUser && targetUser.id !== 'random-broadcast-dummy') {
      setDisplayAvatar(targetUser.avatarUri);
      setStatusText('Request Sent');
      if (onProceedWithDirectCall) onProceedWithDirectCall();
    } else {
      runRandomMatchLogic();
    }
  };`
);

// Update runRandomMatchLogic
content = content.replace(
  /  const runRandomMatchLogic = async \(\) => \{[\s\S]*?\} catch \(e\) \{\n      console\.log\('Random match error:', e\);\n      if \(roamingInterval\.current\) clearInterval\(roamingInterval\.current\);\n      setStatusText\('No creators available'\);\n      setDots\(''\);\n      setTimeout\(\(\) => \{\n        onClose\(\);\n      \}, 2000\);\n    \}\n  \};/,
  `  const runRandomMatchLogic = async () => {
    try {
      const creatorsRes = await apiClient.get('/api/feed/creators');
      const creatorsList = creatorsRes.data?.data || [];
      const avatars = creatorsList.length > 0 
        ? creatorsList.map((c: any) => c.avatar_url || 'https://i.pravatar.cc/300')
        : ['https://i.pravatar.cc/300?img=1', 'https://i.pravatar.cc/300?img=5', 'https://i.pravatar.cc/300?img=9'];

      let currentIndex = 0;
      roamingInterval.current = setInterval(() => {
        setDisplayAvatar(avatars[currentIndex % avatars.length]);
        currentIndex++;
      }, 120);

      await new Promise<void>(resolve => setTimeout(resolve, 2500));

      if (roamingInterval.current) clearInterval(roamingInterval.current);
      
      // Keep displaying a random final avatar to show they are "broadcasting"
      const finalAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      setDisplayAvatar(finalAvatar);
      setStatusText('Broadcasting to online creators');

      // Trigger the broadcast in HomeScreen
      if (onProceedWithDirectCall) onProceedWithDirectCall();
      
    } catch (e) {
      console.log('Random match error:', e);
      if (roamingInterval.current) clearInterval(roamingInterval.current);
      setStatusText('No creators available');
      setDots('');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
