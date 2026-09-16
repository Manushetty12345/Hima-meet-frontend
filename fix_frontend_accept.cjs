const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\r\n/g, '\n');

const regex = /      const handleCallAccepted = \(data: \{ callId: number, agoraToken\?: string, rate\?: number \}\) => \{\n        clearCallTimeout\(\);\n        setShowRandomMatch\(false\);\n        \/\/ Use refs \(not state\) to avoid stale closure bug\n        const callType = randomMatchTypeRef\.current;\n        const callTarget = randomMatchTargetRef\.current;\n        setTimeout\(\(\) => \{\n          navigation\.navigate\(callType === 'audio' \? 'AudioCallScreen' : 'VideoCallScreen', \{\n            callId: data\.callId,\n            targetId: callTarget\?\.id,\n            calleeName: callTarget\?\.name,\n            calleeAvatar: callTarget\?\.avatarUri,\n            agoraToken: data\.agoraToken \|\| '',\n            callRate: data\.rate \|\| \(callType === 'audio' \? 20 : 40\),\n          \} as any\);\n        \}, 300\);\n      \};/;

const newBlock = `      const handleCallAccepted = (data: { callId: number, agoraToken?: string, rate?: number, receiverId?: string, receiverName?: string, receiverAvatar?: string }) => {
        clearCallTimeout();
        setShowRandomMatch(false);
        // Use refs (not state) to avoid stale closure bug
        const callType = randomMatchTypeRef.current;
        const callTarget = randomMatchTargetRef.current;
        setTimeout(() => {
          navigation.navigate(callType === 'audio' ? 'AudioCallScreen' : 'VideoCallScreen', {
            callId: data.callId,
            targetId: data.receiverId || callTarget?.id,
            calleeName: data.receiverName || callTarget?.name,
            calleeAvatar: data.receiverAvatar || callTarget?.avatarUri,
            agoraToken: data.agoraToken || '',
            callRate: data.rate || (callType === 'audio' ? 20 : 40),
          } as any);
        }, 300);
      };`;

content = content.replace(regex, newBlock);
fs.writeFileSync(file, content);
console.log("SUCCESS");
