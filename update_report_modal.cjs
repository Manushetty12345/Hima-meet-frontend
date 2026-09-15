const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/ReportUserModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add ScrollView import
content = content.replace(
  /import \{ View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert \} from 'react-native';/,
  "import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';"
);

// Wrap modalContainer in ScrollView
content = content.replace(
  /<KeyboardAvoidingView behavior=\{Platform\.OS === 'ios' \? 'padding' : undefined\} style=\{styles\.overlay\}>/,
  `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}} keyboardShouldPersistTaps="handled">`
);

content = content.replace(
  /<\/KeyboardAvoidingView>/,
  `</ScrollView>
      </KeyboardAvoidingView>`
);

// Replace styles
content = content.replace(/backgroundColor: '#FF1493',/g, "backgroundColor: '#5B0E8B',");
content = content.replace(/borderColor: '#FF1493',/g, "borderColor: '#5B0E8B',");
content = content.replace(/backgroundColor: '#FDF2F6',/g, "backgroundColor: '#FBF7FF',");
content = content.replace(/color: '#FF1493',/g, "color: '#5B0E8B',");

fs.writeFileSync(file, content);
console.log("SUCCESS");
