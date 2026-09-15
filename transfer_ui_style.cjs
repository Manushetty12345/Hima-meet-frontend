const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. StatusBar
content = content.replace(
  /<StatusBar barStyle="light-content"/,
  '<StatusBar barStyle="dark-content"'
);

// 2. coverContainer JSX replacement
content = content.replace(
  /<Image\s*source=\{\{ uri: avatarImage \}\}\s*style=\{styles\.coverImage\}\s*blurRadius=\{10\}\s*\/>\s*<LinearGradient\s*colors=\{\['rgba\(0,0,0,0\.5\)', 'rgba\(0,0,0,0\.1\)', BG_COLOR\]\}\s*style=\{StyleSheet\.absoluteFill\}\s*\/>/m,
  `<LinearGradient
            colors={['#FBF7FF', '#EFDFFB']}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={StyleSheet.absoluteFill}
          />`
);

// 3. stickyHeaderContainer LinearGradient
content = content.replace(
  /<LinearGradient\s*colors=\{\['#FF1493', '#9C27B0'\]\}\s*start=\{\{ x: 0, y: 0 \}\}\s*end=\{\{ x: 1, y: 0 \}\}\s*style=\{StyleSheet\.absoluteFill\}\s*\/>/m,
  `<LinearGradient
            colors={['#FBF7FF', '#EFDFFB']}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={StyleSheet.absoluteFill}
          />`
);

// 4. ArrowLeft color
content = content.replace(
  /<ArrowLeft size=\{24\} color="#FFFFFF" \/>/,
  '<ArrowLeft size={24} color="#2A1240" />'
);

// 5. Heart color (when not favorited)
content = content.replace(
  /color=\{isFavorite \? PINK : "#FFFFFF"\}/,
  'color={isFavorite ? PINK : "#2A1240"}'
);

// 6. headerTitle color in StyleSheet
content = content.replace(
  /headerTitle: \{\s*fontSize: 18,\s*fontWeight: '800',\s*color: '#FFFFFF',/,
  `headerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#2A1240',`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
