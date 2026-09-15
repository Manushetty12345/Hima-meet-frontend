const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update headerIconBtn to be a square-ish box with white background
content = content.replace(
  /headerIconBtn: \{\s*width: 40,\s*height: 40,\s*borderRadius: 20,\s*backgroundColor: 'rgba\(0,0,0,0\.25\)',/m,
  `headerIconBtn: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,`
);

// 2. Change ArrowLeft color
content = content.replace(
  /<ArrowLeft size=\{24\} color="#2A1240" \/>/,
  '<ArrowLeft size={24} color="#5B0E8B" />'
);

// 3. Change Heart icon color (when not favored)
content = content.replace(
  /color=\{isFavorite \? PINK : "#2A1240"\}/,
  'color={isFavorite ? PINK : "#5B0E8B"}'
);

// 4. Change Add Friend button gradient colors
content = content.replace(
  /colors=\{\['#FF1493', '#9C27B0'\]\}\s*start=\{\{ x: 0, y: 0 \}\}\s*end=\{\{ x: 1, y: 1 \}\}\s*style=\{styles\.addFriendBtn\}/,
  `colors={['#5B0E8B', '#2A1240']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addFriendBtn}`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
