const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Video colors: PLUM_ROYAL -> '#9C27B0' and '#B9AFC4' -> '#D1D5DB'
content = content.replace(
  /<Video size=\{16\} color=\{\(isOnline && creator\.videoAvailable\) \? PLUM_ROYAL : '#B9AFC4'\} fill=\{\(isOnline && creator\.videoAvailable\) \? PLUM_ROYAL : '#B9AFC4'\} \/>/,
  `<Video size={16} color={(isOnline && creator.videoAvailable) ? '#9C27B0' : '#D1D5DB'} fill={(isOnline && creator.videoAvailable) ? '#9C27B0' : '#D1D5DB'} />`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
