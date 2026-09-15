const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ScrollView')) {
    // wait, ScrollView is used, but is it imported?
    // Let's replace `import { View, Text,` with `import { View, Text, ScrollView,`
    const importMatch = content.match(/import\s+\{[^}]*\}\s+from\s+['"]react-native['"]/);
    if (importMatch) {
        let importStr = importMatch[0];
        if (!importStr.includes('ScrollView')) {
            let newImportStr = importStr.replace('View,', 'View, ScrollView,');
            content = content.replace(importStr, newImportStr);
            fs.writeFileSync(file, content);
            console.log("SUCCESS: Imported ScrollView");
        }
    } else {
        console.log("Could not find react-native import");
    }
} else {
    // Check if it's already in the import statement
    const importMatch = content.match(/import\s+\{[^}]*\}\s+from\s+['"]react-native['"]/);
    if (importMatch) {
        let importStr = importMatch[0];
        if (!importStr.includes('ScrollView')) {
            let newImportStr = importStr.replace('View,', 'View, ScrollView,');
            content = content.replace(importStr, newImportStr);
            fs.writeFileSync(file, content);
            console.log("SUCCESS: Imported ScrollView (was missing from import)");
        } else {
            console.log("ScrollView is already imported");
        }
    }
}
