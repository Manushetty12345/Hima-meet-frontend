const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<KeyboardAvoidingView\s*behavior=\{Platform\.OS === 'ios' \? 'padding' : undefined\}\s*style=\{\{ backgroundColor: 'transparent' \}\}\s*>/,
  `<KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={{ backgroundColor: 'transparent' }}
          >`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
