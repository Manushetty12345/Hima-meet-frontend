const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change the outer <View style={{ flex: 1, backgroundColor: '#F4EDFB' }}> to KeyboardAvoidingView
content = content.replace(
  /<View style=\{\{ flex: 1, backgroundColor: '#F4EDFB' \}\}>/g,
  `<KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={{ flex: 1, backgroundColor: '#F4EDFB' }}
          >`
);

// 2. Remove the old KeyboardAvoidingView tag that was only wrapping the footer
content = content.replace(
  /<KeyboardAvoidingView\s*behavior=\{Platform\.OS === 'ios' \? 'padding' : 'height'\}\s*keyboardVerticalOffset=\{Platform\.OS === 'ios' \? 0 : 20\}\s*style=\{\{ backgroundColor: 'transparent' \}\}\s*>/g,
  `<View style={{ backgroundColor: 'transparent' }}>`
);

// 3. The end of the modal had: </KeyboardAvoidingView>\n          </View>
// Now it should be </View>\n          </KeyboardAvoidingView>
content = content.replace(
  /<\/KeyboardAvoidingView>\s*<\/View>/g,
  `</View>\n          </KeyboardAvoidingView>`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
