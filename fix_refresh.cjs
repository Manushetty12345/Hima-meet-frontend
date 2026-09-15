const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add a refresh toggle state
content = content.replace(
  /const \[isLoading, setIsLoading\] = useState\(false\);/,
  `const [isLoading, setIsLoading] = useState(false);\n  const [refreshToggle, setRefreshToggle] = useState(0);`
);

// 2. Add refreshToggle to the dependency array of the useEffect that has fetchData
content = content.replace(
  /    \}, \[activeTab\]\);/g,
  `    }, [activeTab, refreshToggle]);`
);

// 3. Update the onClose handler to also trigger a refresh
content = content.replace(
  /onClose=\{.*?setSelectedCreator\(null\).*?\}/,
  `onClose={() => { setSelectedCreator(null); setRefreshToggle(prev => prev + 1); }}`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
