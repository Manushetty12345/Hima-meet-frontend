const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `<View style={styles.tabRow}>`;
const newStr = `<ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabRow}
        >`;

const targetEndStr = `</View>

        <View style={styles.searchContainer}>`;
const newEndStr = `</ScrollView>

        <View style={styles.searchContainer}>`;

if (content.includes(targetStr) && content.includes(targetEndStr)) {
  content = content.replace(targetStr, newStr);
  content = content.replace(targetEndStr, newEndStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  // Try CRLF
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget1 = targetStr.replace(/\r\n/g, '\n');
  const normalizedTarget2 = targetEndStr.replace(/\r\n/g, '\n');
  
  if (normalizedContent.includes(normalizedTarget1) && normalizedContent.includes(normalizedTarget2)) {
    content = normalizedContent.replace(normalizedTarget1, newStr.replace(/\r\n/g, '\n'));
    content = content.replace(normalizedTarget2, newEndStr.replace(/\r\n/g, '\n'));
    fs.writeFileSync(file, content);
    console.log("SUCCESS via CRLF");
  } else {
    console.log("FAILED to find targets");
  }
}
