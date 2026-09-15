const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/profile/screens/DeleteAccountScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetKV = `<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>`;
const replaceKV = `<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}>`;

const targetScroll = `<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>`;
const replaceScroll = `<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={true}>`;

content = content.replace(targetKV, replaceKV);
content = content.replace(targetScroll, replaceScroll);

fs.writeFileSync(file, content);
console.log("Updated KeyboardAvoidingView and ScrollView");
