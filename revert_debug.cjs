const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove debug state
content = content.replace(/const \[debugText, setDebugText\] = useState\(""\);\n\s*/, '');

// Remove setDebugText
content = content.replace(/setDebugText\(JSON\.stringify\(res\.data\.data\)\);\n\s*/, '');

// Remove UI rendering of debugText
content = content.replace(/<Text style=\{\{padding: 10, backgroundColor: '#f0f0f0', fontSize: 10\}\}>\{debugText\}<\/Text>\n\s*/, '');

fs.writeFileSync(file, content);
console.log("SUCCESS");
