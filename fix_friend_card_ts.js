const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendRequestCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  conversationId?: string | number;
};`;

const newStr = `  conversationId?: string | number;
  callAvailable?: boolean;
  videoAvailable?: boolean;
};`;

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
    console.log("FAILED to find conversationId in type definition");
  }
}
