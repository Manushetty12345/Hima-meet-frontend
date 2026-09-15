const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/profile/screens/DeleteAccountScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The import might be multiline or single line. We'll use a regex that matches `from 'react-native';`
const regex = /from\s+'react-native';/g;

if (!content.includes('KeyboardAvoidingView,')) {
    // If it's a multiline block ending with "} from 'react-native'", we can do:
    const regexMulti = /}\s*from\s*'react-native';/g;
    content = content.replace(regexMulti, "  KeyboardAvoidingView,\n} from 'react-native';");
}

fs.writeFileSync(file, content);
console.log("Fixed KeyboardAvoidingView import");
