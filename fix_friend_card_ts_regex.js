const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendRequestCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /conversationId\?: string \| number;/;
if (regex.test(content)) {
  content = content.replace(regex, "conversationId?: string | number;\n  callAvailable?: boolean;\n  videoAvailable?: boolean;");
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED regex");
}
