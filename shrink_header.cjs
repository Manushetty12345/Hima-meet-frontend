const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Avatar size 52 -> 40
content = content.replace(/width: 52,\s*height: 52,\s*borderRadius: 26,/g, `width: 40,\n      height: 40,\n      borderRadius: 20,`);

// Name size 18 -> 15.5
content = content.replace(/headerName: \{\s*fontSize: 18,/, `headerName: {\n      fontSize: 15.5,`);

// Header status font size
content = content.replace(/headerStatusText: \{\s*fontSize: 12,/, `headerStatusText: {\n      fontSize: 10.5,`);

// Action circle size 42 -> 36
content = content.replace(/width: 42,\s*height: 42,\s*borderRadius: 21,/g, `width: 36,\n      height: 36,\n      borderRadius: 18,`);

// Icon sizes inside circles 20 -> 16
content = content.replace(/<Phone size=\{20\}/g, `<Phone size={16}`);
content = content.replace(/<Video size=\{20\}/g, `<Video size={16}`);

// Center alignment for headerCenter
content = content.replace(/alignItems: 'center',\s*marginLeft: 12,\s*gap: 10,/, `alignItems: 'center',\n      marginLeft: 12,\n      gap: 10,`);
content = content.replace(/<View style=\{\{ alignItems: 'center' \}\}>/, `<View style={{ alignItems: 'flex-start' }}>`);

fs.writeFileSync(file, content);
console.log("SUCCESS");
