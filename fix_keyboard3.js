const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/profile/screens/DeleteAccountScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetKV = `<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}>`;
const replaceKV = `<View style={styles.flex}>`;

const targetKVClose = `</KeyboardAvoidingView>`;
const replaceKVClose = `</View>`;

content = content.replace(targetKV, replaceKV);
content = content.replace(targetKVClose, replaceKVClose);

fs.writeFileSync(file, content);
console.log("Removed KeyboardAvoidingView");
