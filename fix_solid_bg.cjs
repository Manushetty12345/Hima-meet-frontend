const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the gradient with a solid premium background color so the header, body, and footer share the exact same beautiful background color without fading to white
content = content.replace(
  /<LinearGradient colors=\{\['#F9F5FD', '#FFFFFF'\]\} start=\{\{ x: 0, y: 0 \}\} end=\{\{ x: 0, y: 1 \}\} style=\{\{ flex: 1 \}\}>/,
  `<View style={{ flex: 1, backgroundColor: '#F4EDFB' }}>` // Solid beautiful lavender matching the image
);
content = content.replace(
  /<\/KeyboardAvoidingView>\s*<\/LinearGradient>/,
  `</KeyboardAvoidingView>\n        </View>`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
