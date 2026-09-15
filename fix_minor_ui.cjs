const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change back button color from PINK (#FF3366) to deep purple (#2A1240)
content = content.replace(
  /<ArrowLeft size=\{16\} color=\{PINK\} \/>/,
  `<ArrowLeft size={16} color="#2A1240" />`
);

// 2. Change Online text color from blue (#34B7F1) to green (#10B981)
content = content.replace(
  /headerStatusText: \{\s*fontSize: 10\.5,\s*color: '#34B7F1',/,
  `headerStatusText: {\n      fontSize: 10.5,\n      color: '#10B981',`
);

// 3. Style the 3-dot (MoreVertical) button to match the sleek back button
content = content.replace(
  /<MoreVertical size=\{24\} color=\{TEXT_MUTED\} \/>/,
  `<MoreVertical size={16} color="#2A1240" />`
);
content = content.replace(
  /moreBtn: \{\s*paddingLeft: 4,\s*\}/,
  `moreBtn: {\n      width: 32,\n      height: 32,\n      borderRadius: 10,\n      backgroundColor: '#FFFFFF',\n      shadowColor: '#000',\n      shadowOffset: { width: 0, height: 2 },\n      shadowOpacity: 0.05,\n      shadowRadius: 4,\n      elevation: 2,\n      alignItems: 'center',\n      justifyContent: 'center',\n      marginLeft: 4,\n    }`
);

// 4. Remove dropdown dividers
content = content.replace(/<View style=\{styles\.dropdownDivider\} \/>/g, '');

fs.writeFileSync(file, content);
console.log("SUCCESS");
