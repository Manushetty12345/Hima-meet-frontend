const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Phone icon color
content = content.replace(/color=\{isAudioAvailable \? '#FF1493' : '#9CA3AF'\}/g, "color={isAudioAvailable ? '#6B7280' : '#D1D5DB'}");
content = content.replace(/fill=\{isAudioAvailable \? '#FF1493' : '#9CA3AF'\}/g, "fill={isAudioAvailable ? '#6B7280' : '#D1D5DB'}");

// Update Video icon color
content = content.replace(/color=\{isVideoAvailable \? '#FF1493' : '#9CA3AF'\}/g, "color={isVideoAvailable ? '#6B7280' : '#D1D5DB'}");
content = content.replace(/fill=\{isVideoAvailable \? '#FF1493' : '#9CA3AF'\}/g, "fill={isVideoAvailable ? '#6B7280' : '#D1D5DB'}");

// Update the border color of the callBtn when online to not be pink
content = content.replace(/callBtnOnline: \{\s*borderColor: '#FCE7F3',\s*\}/, "callBtnOnline: {\n    borderColor: '#E5E7EB',\n  }");

fs.writeFileSync(file, content);
console.log("SUCCESS");
