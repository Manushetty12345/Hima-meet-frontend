const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/profile/screens/DeleteAccountScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetScrollOpen = `<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={true}>`;
const replaceScrollOpen = `<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={true}>`;

const targetScrollClose = `      </ScrollView>`;
const replaceScrollClose = `      </ScrollView>
      </KeyboardAvoidingView>`;

content = content.replace(targetScrollOpen, replaceScrollOpen);
content = content.replace(targetScrollClose, replaceScrollClose);

fs.writeFileSync(file, content);
console.log("Wrapped ScrollView in KeyboardAvoidingView");
