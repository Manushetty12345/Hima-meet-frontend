const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  const handleAddFriend = () => {
    setFriendStatus('sent');
    showToast('Friend request sent successfully');
  };

  const handleCancelFriend = () => {
    setFriendStatus('none');
    showToast('Friend request cancelled successfully');
  };`;

const newStr = `  const handleAddFriend = async () => {
    if (!creatorId) return;
    setFriendStatus('pending'); // optimistic update
    try {
      await apiClient.post('/api/friends/request', { target_user_id: creatorId });
      showToast('Friend request sent successfully');
    } catch (error) {
      console.error('Failed to send request', error);
      setFriendStatus('none'); // revert
      showToast('Failed to send friend request');
    }
  };

  const handleCancelFriend = async () => {
    if (!creatorId) return;
    setFriendStatus('none'); // optimistic update
    try {
      await apiClient.post('/api/friends/cancel', { target_user_id: creatorId });
      showToast('Friend request cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel request', error);
      setFriendStatus('pending'); // revert
      showToast('Failed to cancel friend request');
    }
  };`;

// Also fix the UI condition to check specifically for 'pending' or 'sent' 
const uiTargetStr = `            {/* Add Friend Button */}
            {friendStatus === 'none' ? (`;

const uiNewStr = `            {/* Add Friend Button */}
            {friendStatus === 'none' ? (`;

const uiTargetStr2 = `              </TouchableOpacity>
            ) : (
              <View style={{ marginBottom: 24, gap: 12 }}>
                <View style={[styles.addFriendBtn, { backgroundColor: '#DF7B93', opacity: 0.9, borderRadius: 24 }]}>
                  <UserCheck size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.addFriendText}>Request Sent</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={handleCancelFriend} style={[styles.addFriendBtn, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#FF1493', borderRadius: 24 }]}>
                  <Text style={[styles.addFriendText, { color: '#FF1493' }]}>Cancel Request</Text>
                </TouchableOpacity>
              </View>
            )}`;

const uiNewStr2 = `              </TouchableOpacity>
            ) : (friendStatus === 'pending' || friendStatus === 'sent') ? (
              <View style={{ marginBottom: 24, gap: 12 }}>
                <View style={[styles.addFriendBtn, { backgroundColor: '#DF7B93', opacity: 0.9, borderRadius: 24 }]}>
                  <UserCheck size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.addFriendText}>Request Sent</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={handleCancelFriend} style={[styles.addFriendBtn, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#FF1493', borderRadius: 24 }]}>
                  <Text style={[styles.addFriendText, { color: '#FF1493' }]}>Cancel Request</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ marginBottom: 24 }}>
                <View style={[styles.addFriendBtn, { backgroundColor: '#4A0F6E', borderRadius: 24 }]}>
                  <UserCheck size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.addFriendText}>Friends</Text>
                </View>
              </View>
            )}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  
  // Try CRLF normalization for the UI part
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedUiTarget2 = uiTargetStr2.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedUiTarget2)) {
    content = normalizedContent.replace(normalizedUiTarget2, uiNewStr2.replace(/\r\n/g, '\n'));
    fs.writeFileSync(file, content);
    console.log("SUCCESS");
  } else {
    console.log("FAILED to find UI target");
    fs.writeFileSync(file, content); // still save the API functions
  }
} else {
  // Try CRLF on targetStr
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedTarget)) {
    content = normalizedContent.replace(normalizedTarget, newStr.replace(/\r\n/g, '\n'));
    
    const normalizedUiTarget2 = uiTargetStr2.replace(/\r\n/g, '\n');
    if (content.includes(normalizedUiTarget2)) {
      content = content.replace(normalizedUiTarget2, uiNewStr2.replace(/\r\n/g, '\n'));
    }
    fs.writeFileSync(file, content);
    console.log("SUCCESS via CRLF normalization");
  } else {
    console.log("FAILED to find target function string");
  }
}
