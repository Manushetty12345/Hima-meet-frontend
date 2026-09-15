const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/profile/screens/DeleteAccountScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add KeyboardAvoidingView import
const targetImport = `import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Platform, StatusBar, ActivityIndicator } from 'react-native';`;
const replaceImport = `import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Platform, StatusBar, ActivityIndicator, KeyboardAvoidingView } from 'react-native';`;
content = content.replace(targetImport, replaceImport);

// 2. Wrap root View in KeyboardAvoidingView
const targetRootOpen = `<View style={styles.flex}>
      <StatusBar barStyle="dark-content" />`;
const replaceRootOpen = `<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />`;
content = content.replace(targetRootOpen, replaceRootOpen);

const targetRootClose = `      </View>
    </View>
  );
};`;
const replaceRootClose = `      </View>
    </KeyboardAvoidingView>
  );
};`;
content = content.replace(targetRootClose, replaceRootClose);

// 3. Make button square and move it up
const targetWrapper = `  submitButtonWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
  },`;
const replaceWrapper = `  submitButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },`;
content = content.replace(targetWrapper, replaceWrapper);

fs.writeFileSync(file, content);
console.log("Updated DeleteAccountScreen");
