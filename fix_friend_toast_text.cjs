const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /onShowToast\(\`Notifications off for \$\{item\.name\}\`\);/,
  "onShowToast(`Notifications off for\\n${item.name}`, 'info', true);"
);

content = content.replace(
  /onShowToast\(\`You will be notified when \$\{item\.name\} comes online\`, 'info', true\);/,
  "onShowToast(`You will be notified when\\n${item.name} comes online`, 'info', true);"
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
