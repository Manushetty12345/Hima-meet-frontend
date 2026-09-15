const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendRequestCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `        <LinearGradient
          colors={['#C850C0', '#FF1493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}`;

const newStr = `        <LinearGradient
          colors={['#9C27B0', '#5B0E8B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  // try CRLF
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedTarget)) {
    content = normalizedContent.replace(normalizedTarget, newStr.replace(/\r\n/g, '\n'));
    fs.writeFileSync(file, content);
    console.log("SUCCESS via CRLF");
  } else {
    console.log("FAILED to find gradient colors");
  }
}
