const fs = require('fs');

// 1. Update FriendsScreen.tsx
let fsContent = fs.readFileSync('D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx', 'utf8');

// Replace showToast signature and state
fsContent = fsContent.replace(
  /const \[toastIcon, setToastIcon\] = useState<React\.ReactNode>\(null\);/,
  "const [toastShowLogo, setToastShowLogo] = useState<boolean>(false);"
);

fsContent = fsContent.replace(
  /const showToast = \(message: string, type: 'error' \| 'info' = 'info', icon\?: React\.ReactNode\) => \{[\s\S]*?setToastIcon\(icon \|\| null\);/,
  `const showToast = (message: string, type: 'error' | 'info' = 'info', showLogo: boolean = false) => {
    setToastMessage(message);
    setToastType(type);
    setToastShowLogo(showLogo);`
);

fsContent = fsContent.replace(
  /\{toastIcon\}/,
  `{toastShowLogo && <Image source={require('../../../assets/images/logo1.png')} style={{width: 24, height: 24, marginRight: 10, resizeMode: 'contain'}} />}`
);

// add import Image if not in FriendsScreen
if (!fsContent.includes("import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Animated, Image }")) {
  fsContent = fsContent.replace(
    /import \{ View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Animated \} from 'react-native';/,
    "import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';"
  );
}

fs.writeFileSync('D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx', fsContent);
console.log("SUCCESS FRIENDSSCREEN");

// 2. Update FriendCard.tsx
let fcContent = fs.readFileSync('D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx', 'utf8');

fcContent = fcContent.replace(
  /onShowToast: \(message: string, type\?: 'error' \| 'info', icon\?: React\.ReactNode\) => void;/,
  "onShowToast: (message: string, type?: 'error' | 'info', showLogo?: boolean) => void;"
);

fcContent = fcContent.replace(
  /onShowToast\(\`You will be notified when \$\{item\.name\} comes online\`, 'info', <Image source=\{require\('\.\.\/\.\.\/\.\.\/assets\/images\/logo1\.png'\)\} style=\{\{width: 24, height: 24, marginRight: 10, resizeMode: 'contain'\}\} \/>\);/,
  "onShowToast(`You will be notified when ${item.name} comes online`, 'info', true);"
);

fs.writeFileSync('D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx', fcContent);
console.log("SUCCESS FRIENDCARD");
