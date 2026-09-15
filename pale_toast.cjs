const fs = require('fs');

// 1. FriendCard.tsx (remove newlines, reduce logo size)
let fcContent = fs.readFileSync('D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx', 'utf8');

fcContent = fcContent.replace(
  /onShowToast\(\`Notifications off for\\n\$\{item\.name\}\`, 'info', true\);/,
  "onShowToast(`Notifications off for ${item.name}`, 'info', true);"
);

fcContent = fcContent.replace(
  /onShowToast\(\`You will be notified when\\n\$\{item\.name\} comes online\`, 'info', true\);/,
  "onShowToast(`You will be notified when ${item.name} comes online`, 'info', true);"
);

fs.writeFileSync('D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx', fcContent);
console.log("SUCCESS FRIENDCARD");

// 2. FriendsScreen.tsx (pale purple bg, smaller font, dark text, smaller logo)
let fsContent = fs.readFileSync('D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx', 'utf8');

// Change toast bg to pale purple
fsContent = fsContent.replace(
  "backgroundColor: '#9C27B0', // Light purple for toast",
  "backgroundColor: '#E1BEE7', // Pale light purple"
);

// Reduce logo size in FriendsScreen
fsContent = fsContent.replace(
  /style=\{\{width: 24, height: 24, marginRight: 10, resizeMode: 'contain'\}\}/,
  "style={{width: 16, height: 16, marginRight: 8, resizeMode: 'contain'}}"
);

// Reduce font size and change text color to dark
fsContent = fsContent.replace(
  /toastText: \{\s*color: '#FFFFFF',\s*fontSize: 14,/,
  "toastText: {\n      color: '#4A148C', // Dark purple text for contrast\n      fontSize: 12,"
);

// Ensure error toast remains white text
fsContent = fsContent.replace(
  /toastTextError: \{\s*color: '#FFFFFF',\s*\}/,
  "toastTextError: {\n      color: '#FFFFFF',\n    }"
);

// Make the toast container slightly smaller
fsContent = fsContent.replace(
  /paddingVertical: 12,\s*paddingHorizontal: 20,/,
  "paddingVertical: 8,\n      paddingHorizontal: 16,"
);

fs.writeFileSync('D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx', fsContent);
console.log("SUCCESS FRIENDSSCREEN");
