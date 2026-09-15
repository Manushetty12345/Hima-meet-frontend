const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the opening View with LinearGradient
content = content.replace(
  /<View style=\{styles\.header\}>/,
  `<LinearGradient 
          colors={['#FBF7FF', '#EFDFFB']} 
          start={{ x: 0.15, y: 0 }} 
          end={{ x: 0.85, y: 1 }} 
          style={styles.header}
        >`
);

// Replace the closing View of the header. It is right before the ImageBackground body
content = content.replace(
  /<\/View>\s*<ImageBackground/s,
  `</LinearGradient>\n\n        <ImageBackground`
);

// We should also remove the white background from styles.header so the gradient shows
content = content.replace(
  /borderBottomColor: '#F0EAF6',\s*backgroundColor: '#FFFFFF',/s,
  `borderBottomColor: '#F0EAF6',
      // backgroundColor removed for gradient`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
