const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add handleUnblockUser
content = content.replace(
  /const handleBlockUser = async \(\) => \{/,
  `const handleUnblockUser = async () => {
    try {
      await apiClient.post(\`/api/creator/\${creator.id}/unblock\`);
      setFriendStatus('none');
      showToast('User unblocked successfully');
    } catch (e) {
      console.error('Failed to unblock user', e);
      showToast('Failed to unblock user');
    }
  };

  const handleBlockUser = async () => {`
);

// Add Unblock button
content = content.replace(
  /<Text style=\{styles\.footerSubtitle\}>You have blocked this user\. They cannot contact you\.<\/Text>\s*<\/View>/,
  `<Text style={styles.footerSubtitle}>You have blocked this user. They cannot contact you.</Text>
                <TouchableOpacity
                  style={[styles.friendRequestBtnWrap, { marginTop: 16 }]}
                  activeOpacity={0.85}
                  onPress={handleUnblockUser}
                >
                  <LinearGradient
                    colors={['#5B0E8B', '#2A1240']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.friendRequestBtn}
                  >
                    <Text style={[styles.friendRequestText, { color: '#FFFFFF' }]}>Unblock user</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
