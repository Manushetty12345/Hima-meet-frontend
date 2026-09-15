const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Enable KeyboardAvoidingView behavior on Android too
const t1 = `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`;
const r1 = `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`;

// Fix 2: Increase bottomSpacer so bio field can scroll above keyboard
const t2 = `  bottomSpacer: {
    height: 90,
  },`;
const r2 = `  bottomSpacer: {
    height: 320,
  },`;

// Fix 3: Add keyboardVerticalOffset for Android
const t3 = `    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >`;
const r3 = `    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 0}
    >`;

if (!content.includes(t1)) console.log("t1 not found!");
if (!content.includes(t2)) console.log("t2 not found!");

content = content.replace(t1, r1);
content = content.replace(t2, r2);
fs.writeFileSync(file, content);
console.log("Done!");
