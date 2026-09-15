const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendRequestCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regexReject = /rejectBtn: \{\s*width: 36,\s*height: 36,\s*borderRadius: 18,\s*backgroundColor: '#FFE5E5',\s*alignItems: 'center',\s*justifyContent: 'center',\s*\}/;

const newReject = `rejectBtn: {
      width: 44,
      height: 40,
      borderRadius: 10,
      backgroundColor: '#FFE5E5',
      alignItems: 'center',
      justifyContent: 'center',
    }`;

const regexAccept = /acceptBtn: \{\s*width: 36,\s*height: 36,\s*borderRadius: 18,\s*backgroundColor: '#00D15C',\s*alignItems: 'center',\s*justifyContent: 'center',\s*\}/;

const newAccept = `acceptBtn: {
      width: 44,
      height: 40,
      borderRadius: 10,
      backgroundColor: '#00D15C',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#00D15C',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    }`;

let success = false;
if (regexReject.test(content) && regexAccept.test(content)) {
  content = content.replace(regexReject, newReject);
  content = content.replace(regexAccept, newAccept);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
  success = true;
} else {
  console.log("FAILED regex");
}
