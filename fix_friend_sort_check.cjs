const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Pass isPinned
content = content.replace(
  /callAvailable: item\.callAvailable,\s*videoAvailable: item\.videoAvailable\s*\}\}/g,
  "callAvailable: item.callAvailable, \n                        videoAvailable: item.videoAvailable, \n                        isPinned: item.is_pinned \n                      }}"
);

// 2. Sort the `users` array in useMemo or before mapping
const renderListRegex = /const users = \(/;
// Wait, is it sorted? Let's check how the data is filtered and mapped.
// In FriendsScreen.tsx: 
// const filteredFriends = useMemo(() => { ... return results; }, [friends, ...]);
// I will just add the sort to filteredFriends useMemo.
