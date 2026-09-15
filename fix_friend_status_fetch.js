const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `      const fetchProfile = async () => {
        if (!creatorId) {
          setDebugApiRes('Error: creatorId is undefined!');
          setLoading(false);
          return;
        }
        try {
          const res = await apiClient.get(\`/api/creator/\${creatorId}/profile\`);
          console.log('Creator profile response:', res.data); // Debugging API response
          setDebugApiRes(JSON.stringify(res.data, null, 2));
          if (res.data?.status === 'success') {
            setProfileData(res.data.data);
            setIsFavorite(res.data.data.friendshipStatus === 'favourite');
            setFriendStatus(res.data.data.friendshipStatus || 'none');
            setNotifyOnline(!!res.data.data.is_notify_online_enabled);
            setIsBlocked(!!res.data.data.is_blocked);
          }
        } catch (error) {
          console.error('Failed to fetch creator profile', error);
        } finally {
          setLoading(false);
        }
      };`;

const newStr = `      const fetchProfile = async () => {
        if (!creatorId) {
          setDebugApiRes('Error: creatorId is undefined!');
          setLoading(false);
          return;
        }
        try {
          // Fetch profile and friend status concurrently
          const [profileRes, statusRes] = await Promise.all([
            apiClient.get(\`/api/creator/\${creatorId}/profile\`),
            apiClient.get(\`/api/friends/status/\${creatorId}\`).catch(e => ({ data: { data: { friend_status: 'none' } } }))
          ]);
          
          console.log('Creator profile response:', profileRes.data); // Debugging API response
          setDebugApiRes(JSON.stringify(profileRes.data, null, 2));
          
          if (profileRes.data?.status === 'success') {
            setProfileData(profileRes.data.data);
            setIsFavorite(profileRes.data.data.friendshipStatus === 'favourite');
            setNotifyOnline(!!profileRes.data.data.is_notify_online_enabled);
            setIsBlocked(!!profileRes.data.data.is_blocked);
          }

          // Use the dedicated status endpoint for accurate friend status
          const actualStatus = statusRes.data?.data?.friend_status || 'none';
          setFriendStatus(actualStatus);
          
        } catch (error) {
          console.error('Failed to fetch creator profile', error);
        } finally {
          setLoading(false);
        }
      };`;

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
    console.log("SUCCESS via CRLF");
  } else {
    console.log("FAILED to find fetchProfile");
  }
}
