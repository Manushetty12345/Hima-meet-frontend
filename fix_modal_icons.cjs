const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Phone colors: PINK -> '#9C27B0' and '#B9AFC4' -> '#D1D5DB'
content = content.replace(
  /<Phone size=\{16\} color=\{\(isOnline && creator\.callAvailable\) \? PINK : '#B9AFC4'\} fill=\{\(isOnline && creator\.callAvailable\) \? PINK : 'transparent'\} \/>/,
  `<Phone size={16} color={(isOnline && creator.callAvailable) ? '#9C27B0' : '#D1D5DB'} fill={(isOnline && creator.callAvailable) ? '#9C27B0' : 'transparent'} />`
);

// Replace Video colors: PINK -> '#9C27B0' and '#B9AFC4' -> '#D1D5DB'
content = content.replace(
  /<Video size=\{16\} color=\{\(isOnline && creator\.videoAvailable\) \? PINK : '#B9AFC4'\} fill=\{\(isOnline && creator\.videoAvailable\) \? PINK : 'transparent'\} \/>/,
  `<Video size={16} color={(isOnline && creator.videoAvailable) ? '#9C27B0' : '#D1D5DB'} fill={(isOnline && creator.videoAvailable) ? '#9C27B0' : 'transparent'} />`
);

// Remove the rateRow for Phone
content = content.replace(
  /\{\(isOnline && creator\.callAvailable\) \? \(\s*<View style=\{styles\.rateRow\}>\s*<Coins size=\{10\} color=\{GOLD_DEEP\} \/>\s*<Text style=\{styles\.rateText\}>\{creator\.callRate \|\| 0\}\/min<\/Text>\s*<\/View>\s*\) : \(\s*<Text style=\{styles\.offlineText\}>\{isOnline \? 'Busy' : 'Offline'\}<\/Text>\s*\)\}/,
  `{(isOnline && creator.callAvailable) ? null : (
                  <Text style={styles.offlineText}>{isOnline ? 'Busy' : 'Offline'}</Text>
                )}`
);

// Remove the rateRow for Video
content = content.replace(
  /\{\(isOnline && creator\.videoAvailable\) \? \(\s*<View style=\{styles\.rateRow\}>\s*<Coins size=\{10\} color=\{GOLD_DEEP\} \/>\s*<Text style=\{styles\.rateText\}>\{creator\.videoRate \|\| 0\}\/min<\/Text>\s*<\/View>\s*\) : \(\s*<Text style=\{styles\.offlineText\}>\{isOnline \? 'Busy' : 'Offline'\}<\/Text>\s*\)\}/,
  `{(isOnline && creator.videoAvailable) ? null : (
                  <Text style={styles.offlineText}>{isOnline ? 'Busy' : 'Offline'}</Text>
                )}`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
