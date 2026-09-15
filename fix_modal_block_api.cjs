const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /await apiClient\.post\(\`\/api\/friends\/block\`, \{ target_user_id: creator\.id \}\);/,
  `await apiClient.post(\`/api/creator/\${creator.id}/block\`, { deleteChat: false });`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
