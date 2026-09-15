const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add is_pinned to formatted
content = content.replace(
  /lastMessageTime: item\.lastMessageTime,/,
  "lastMessageTime: item.lastMessageTime,\n              is_pinned: !!item.is_pinned,"
);

// 2. Sort formatted array by is_pinned
content = content.replace(
  /const formatted = res\.data\.data\.map\(\(item: any\) => \(\{([\s\S]*?)\}\)\);/,
  `let formatted = res.data.data.map((item: any) => ({{$1}}));
            formatted.sort((a, b) => {
              if (a.is_pinned && !b.is_pinned) return -1;
              if (!a.is_pinned && b.is_pinned) return 1;
              return 0;
            });`
);
content = content.replace(/let formatted = res\.data\.data\.map\(\(item: any\) => \(\{\{/g, "let formatted = res.data.data.map((item: any) => ({");
content = content.replace(/\}\}\)\);/g, "}));");


// 3. Pass isPinned to FriendCard
content = content.replace(
  /callAvailable: item\.callAvailable, \n                        videoAvailable: item\.videoAvailable \n                      \}\}/g,
  "callAvailable: item.callAvailable, \n                        videoAvailable: item.videoAvailable, \n                        isPinned: item.is_pinned \n                      }}"
);
content = content.replace(
  /callAvailable: item\.callAvailable, \s*videoAvailable: item\.videoAvailable \s*\}\}/g,
  "callAvailable: item.callAvailable, \n                        videoAvailable: item.videoAvailable, \n                        isPinned: item.is_pinned \n                      }}"
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
