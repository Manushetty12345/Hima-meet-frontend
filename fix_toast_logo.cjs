const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /onShowToast\(\`You will be notified when \$\{item\.name\} comes online\`, 'info', <Bell size=\{14\} color="#FF1493" \/>\);/;
const replacement = "onShowToast(`You will be notified when ${item.name} comes online`, 'info', <Image source={require('../../../assets/images/logo1.png')} style={{width: 24, height: 24, marginRight: 10, resizeMode: 'contain'}} />);";

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED REGEX");
}
