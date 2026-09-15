const fs = require('fs');
let fcContent = fs.readFileSync('D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx', 'utf8');

// 1. Name font size
fcContent = fcContent.replace(
  /name: \{\s*fontSize: 14,/,
  "name: {\n      fontSize: 16,"
);

// 2. Avatar ring
fcContent = fcContent.replace(
  /avatarRing: \{\s*width: 44,\s*height: 44,\s*borderRadius: 22,/,
  "avatarRing: {\n      width: 52,\n      height: 52,\n      borderRadius: 26,"
);

// 3. Avatar inner
fcContent = fcContent.replace(
  /avatarInner: \{\s*width: 40,\s*height: 40,\s*borderRadius: 20,/,
  "avatarInner: {\n      width: 48,\n      height: 48,\n      borderRadius: 24,"
);

// 4. Avatar
fcContent = fcContent.replace(
  /avatar: \{\s*width: 38,\s*height: 38,\s*borderRadius: 19,/,
  "avatar: {\n      width: 46,\n      height: 46,\n      borderRadius: 23,"
);

fs.writeFileSync('D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx', fcContent);
console.log("SUCCESS");
