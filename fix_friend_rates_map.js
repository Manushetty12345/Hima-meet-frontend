const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The mapping is done around line 125 in fetchData
const regex = /\[activeTab\]: res\.data\.data\.map\(\(item: any\) => \(\{\s*\.\.\.item,\s*type,\s*\}\)\),/;
const newStr = `[activeTab]: res.data.data.map((item: any) => ({
              ...item,
              type,
              callRate: item.voice_rate,
              videoRate: item.video_rate
            })),`;

if (regex.test(content)) {
  content = content.replace(regex, newStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED regex");
}
