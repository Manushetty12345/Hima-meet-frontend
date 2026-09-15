const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /onShowToast\(\`You will be notified when \$\{item\.name\} comes online\`, 'info'\);/;
const replacement = "onShowToast(`You will be notified when ${item.name} comes online`, 'info', <Bell size={14} color=\"#FF1493\" />);";

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("SUCCESS");
