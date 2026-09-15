const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Phone icon color
content = content.replace(/color=\{isAudioAvailable \? '#6B7280' : '#D1D5DB'\}/g, "color={isAudioAvailable ? '#9C27B0' : '#D1D5DB'}");
content = content.replace(/fill=\{isAudioAvailable \? '#6B7280' : '#D1D5DB'\}/g, "fill={isAudioAvailable ? '#9C27B0' : '#D1D5DB'}");

// Update Video icon color
content = content.replace(/color=\{isVideoAvailable \? '#6B7280' : '#D1D5DB'\}/g, "color={isVideoAvailable ? '#9C27B0' : '#D1D5DB'}");
content = content.replace(/fill=\{isVideoAvailable \? '#6B7280' : '#D1D5DB'\}/g, "fill={isVideoAvailable ? '#9C27B0' : '#D1D5DB'}");

// Add a very subtle purple border when online so it matches the aesthetic
content = content.replace(/callBtnOnline: \{\s*borderColor: '#E5E7EB',\s*\}/, "callBtnOnline: {\n    borderColor: '#F3E5F5',\n  }");

fs.writeFileSync(file, content);
console.log("SUCCESS");
