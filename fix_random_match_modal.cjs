const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/components/RandomMatchModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// 1. Update onMatchFound type definition
content = content.replace(
  /onMatchFound\?: \(creator: \{ id: string; name: string; avatarUri: string \}\) => void;/,
  `onMatchFound?: (creator: { id: string; name: string; avatarUri: string; callRate?: number; videoRate?: number }) => void;`
);

// 2. Update the invocation of onMatchFound
content = content.replace(
  /onMatchFound\(\{\n\s*id: String\(matchedData\.matched_creator_id\),\n\s*name: matchedData\.name \|\| 'Random Match',\n\s*avatarUri: finalAvatar\n\s*\}\);/,
  `onMatchFound({
              id: String(matchedData.matched_creator_id),
              name: matchedData.name || 'Random Match',
              avatarUri: finalAvatar,
              callRate: matchedData.call_rate,
              videoRate: matchedData.video_rate
            });`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
