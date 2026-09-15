const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<ImageBackground source=\{require\('\.\.\/\.\.\/\.\.\/assets\/images\/chat_bg\.jpg'\)\} style=\{\{ flex: 1 \}\} imageStyle=\{\{ opacity: 0\.15 \}\}>/g,
  `<LinearGradient colors={['#F9F5FD', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>`
);

content = content.replace(
  /<\/KeyboardAvoidingView>\s*<\/ImageBackground>/g,
  `</KeyboardAvoidingView>\n        </LinearGradient>`
);

content = content.replace(
  /<LinearGradient colors=\{\['rgba\(251,247,255,0\.7\)', 'rgba\(239,223,251,0\.9\)'\]\} style=\{styles\.body\}>/g,
  `<View style={styles.body}>`
);
content = content.replace(
  /<\/View>\s*\{\/\* Bottom CTA \/ Input \*\/\}/s,
  `</View>\n        {/* Bottom CTA / Input */}`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
