const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Pull fetchStatus out of useEffect
content = content.replace(
  /useEffect\(\(\) => \{\s*if \(visible && creator\) \{\s*const fetchStatus = async \(\) => \{/,
  `const fetchStatus = async () => {
      if (creator) {
        setIsLoadingStatus(true);
        try {
          const res = await apiClient.get(\`/api/friends/status/\${creator.id}\`);
          setFriendStatus(res.data?.data?.friend_status || 'none');
        } catch (e) {
          console.error('Failed to fetch friend status', e);
        } finally {
          setIsLoadingStatus(false);
        }
      }
    };

  useEffect(() => {
    if (visible && creator) {`
);

// Remove the inner implementation of fetchStatus that we just pulled out
content = content.replace(
  /setIsLoadingStatus\(true\);\s*try \{\s*const res = await apiClient\.get\(\`\/api\/friends\/status\/\$\{creator\.id\}\`\);\s*setFriendStatus\(res\.data\?\.data\?\.friend_status \|\| 'none'\);\s*\} catch \(e\) \{\s*console\.error\('Failed to fetch friend status', e\);\s*\} finally \{\s*setIsLoadingStatus\(false\);\s*\}\s*\};\s*fetchStatus\(\);/,
  `fetchStatus();`
);

// Call fetchStatus in handleUnblockUser
content = content.replace(
  /setFriendStatus\('none'\);\s*showToast\('User unblocked successfully'\);/,
  `await fetchStatus();
      showToast('User unblocked successfully');`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
