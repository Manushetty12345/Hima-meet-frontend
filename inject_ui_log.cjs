const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add debugText state
content = content.replace(
  /const \[isLoading, setIsLoading\] = useState\(false\);/,
  `const [isLoading, setIsLoading] = useState(false);\n  const [debugText, setDebugText] = useState("");`
);

// 2. Set debugText in fetchData
content = content.replace(
  /if \(res\?\.data\?\.status === 'success'\) \{.*?\}/,
  `if (res?.data?.status === 'success') { setDebugText(JSON.stringify(res.data.data.slice(0, 2))); }`
);

// 3. Render debugText above the FlatList
content = content.replace(
  /\{data\[activeTab\]\.length > 0 \? \(/,
  `<Text style={{padding: 10, backgroundColor: '#f0f0f0', fontSize: 10}}>{debugText}</Text>\n          {data[activeTab].length > 0 ? (`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
