const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Remove Android KeyboardAvoidingView behavior - it causes the layout
// jump -> scroll -> blur -> keyboard dismiss "blink" on Android
const t1 = `      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`;
const r1 = `      behavior={Platform.OS === 'ios' ? 'padding' : undefined}`;

// Fix 2: Change keyboardShouldPersistTaps from "handled" to "always"
// so tapping the bio field never gets intercepted and dismissed
const t2 = `        keyboardShouldPersistTaps="handled"`;
const r2 = `        keyboardShouldPersistTaps="always"`;

if (!content.includes(t1)) console.log("t1 not found!");
if (!content.includes(t2)) console.log("t2 not found!");

content = content.replace(t1, r1);
content = content.replace(t2, r2);
fs.writeFileSync(file, content);
console.log("Done!");
