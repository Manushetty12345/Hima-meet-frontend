const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Phone Button
content = content.replace(
  /disabled=\{!item\.callAvailable\}/g,
  `disabled={!(item.isOnline && item.callAvailable)}`
);
content = content.replace(
  /style=\{\[styles\.callBtn, item\.callAvailable && styles\.callBtnOnline\]\}/g,
  `style={[styles.callBtn, (item.isOnline && item.callAvailable) && styles.callBtnOnline]}`
);
content = content.replace(
  /color=\{item\.callAvailable \? '#9C27B0' : '#D1D5DB'\}/g,
  `color={(item.isOnline && item.callAvailable) ? '#9C27B0' : '#D1D5DB'}`
);
content = content.replace(
  /fill=\{item\.callAvailable \? '#9C27B0' : '#D1D5DB'\}/g,
  `fill={(item.isOnline && item.callAvailable) ? '#9C27B0' : '#D1D5DB'}`
);
content = content.replace(
  /\{item\.callAvailable \? \(/g,
  `{(item.isOnline && item.callAvailable) ? (`
);

// Update Video Button
content = content.replace(
  /disabled=\{!item\.videoAvailable\}/g,
  `disabled={!(item.isOnline && item.videoAvailable)}`
);
content = content.replace(
  /style=\{\[styles\.callBtn, item\.videoAvailable && styles\.callBtnOnline\]\}/g,
  `style={[styles.callBtn, (item.isOnline && item.videoAvailable) && styles.callBtnOnline]}`
);
content = content.replace(
  /color=\{item\.videoAvailable \? '#9C27B0' : '#D1D5DB'\}/g,
  `color={(item.isOnline && item.videoAvailable) ? '#9C27B0' : '#D1D5DB'}`
);
content = content.replace(
  /fill=\{item\.videoAvailable \? '#9C27B0' : '#D1D5DB'\}/g,
  `fill={(item.isOnline && item.videoAvailable) ? '#9C27B0' : '#D1D5DB'}`
);
content = content.replace(
  /\{item\.videoAvailable \? \(/g,
  `{(item.isOnline && item.videoAvailable) ? (`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
