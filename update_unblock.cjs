const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Extract fetchProfile outside of useEffect
content = content.replace(
  /useEffect\(\(\) => \{\s*const fetchProfile = async \(\) => \{/,
  `const fetchProfile = async () => {`
);

// 2. Adjust useEffect to just call it
content = content.replace(
  /fetchProfile\(\);\s*\}, \[creatorId\]\);/g,
  `};

  useEffect(() => {
    fetchProfile();
  }, [creatorId]);`
);

// 3. Add fetchProfile() call inside handleBlockSubmit
content = content.replace(
  /setIsBlocked\(true\);\s*showToast\('User blocked successfully'\);/,
  `setIsBlocked(true);
      await fetchProfile();
      showToast('User blocked successfully');`
);

// 4. Add fetchProfile() call inside handleUnblock
content = content.replace(
  /setIsBlocked\(false\);\s*showToast\('User unblocked successfully'\);/,
  `setIsBlocked(false);
      await fetchProfile();
      showToast('User unblocked successfully');`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
