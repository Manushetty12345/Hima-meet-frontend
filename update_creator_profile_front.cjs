const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the line that incorrectly sets isFavorite based on friendshipStatus
content = content.replace(
  /setIsFavorite\(res\.data\.data\.friendshipStatus === 'favourite'\);/,
  `setIsFavorite(!!res.data.data.is_favourite);`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
