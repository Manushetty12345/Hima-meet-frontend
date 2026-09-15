const fs = require('fs');
const file = 'src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The error was on line 400 & 401 where I probably tried to check callAvailable on a friend item. 
// FriendsScreen items use call_available / video_available.
content = content.replace(/item\.callAvailable/g, 'item.call_available');
content = content.replace(/item\.videoAvailable/g, 'item.video_available');

fs.writeFileSync(file, content);
console.log("FriendsScreen properties fixed!");
