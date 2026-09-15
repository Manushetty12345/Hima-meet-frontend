const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `        {(activeTab === 'friends' || activeTab === 'favourite') && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              placeholderTextColor="#8B7F98"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Search size={18} color="#4B5563" />
          </View>
        )}`;

const newStr = `        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            placeholderTextColor="#8B7F98"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Search size={18} color="#4B5563" />
        </View>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  // Try CRLF
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedTarget)) {
    content = normalizedContent.replace(normalizedTarget, newStr.replace(/\r\n/g, '\n'));
    fs.writeFileSync(file, content);
    console.log("SUCCESS via CRLF normalization");
  } else {
    console.log("FAILED to find search box string");
  }
}
