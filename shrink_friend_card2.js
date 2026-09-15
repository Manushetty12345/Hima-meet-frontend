const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Avatar
content = content.replace(/avatarRing: \{\s*width: 50,\s*height: 50,\s*borderRadius: 25,/, "avatarRing: {\n    width: 44,\n    height: 44,\n    borderRadius: 22,");
content = content.replace(/avatarInner: \{\s*width: 46,\s*height: 46,\s*borderRadius: 23,/, "avatarInner: {\n    width: 40,\n    height: 40,\n    borderRadius: 20,");
content = content.replace(/avatar: \{\s*width: 42,\s*height: 42,\s*borderRadius: 21,/, "avatar: {\n    width: 38,\n    height: 38,\n    borderRadius: 19,");

// Update Text
content = content.replace(/name: \{\s*fontSize: 15,/, "name: {\n    fontSize: 14,");
content = content.replace(/lastMessageText: \{\s*fontSize: 12,/, "lastMessageText: {\n    fontSize: 11,");

// Update Top Icons size 16 -> 14
content = content.replace(/<Pin size=\{16\}/g, "<Pin size={14}");
content = content.replace(/<BellOff size=\{16\}/g, "<BellOff size={14}");
content = content.replace(/<Bell size=\{16\}/g, "<Bell size={14}");

// Update Call Action Button & Icons
content = content.replace(/<Phone size=\{16\}/g, "<Phone size={14}");
content = content.replace(/<Video size=\{16\}/g, "<Video size={14}");
content = content.replace(/callBtn: \{\s*width: 36,\s*height: 36,\s*borderRadius: 18,/, "callBtn: {\n    width: 32,\n    height: 32,\n    borderRadius: 16,");
content = content.replace(/callAction: \{\s*alignItems: 'center',\s*justifyContent: 'center',\s*width: 44,/, "callAction: {\n    alignItems: 'center',\n    justifyContent: 'center',\n    width: 40,");

// Update Rate Text
content = content.replace(/rateText: \{\s*fontSize: 10,/, "rateText: {\n    fontSize: 9,");
content = content.replace(/offlineText: \{\s*fontSize: 10,/, "offlineText: {\n    fontSize: 9,");

// Update Card Padding & Margins
content = content.replace(/padding: 12,\s*marginBottom: 8,/, "padding: 10,\n    marginBottom: 6,");
content = content.replace(/marginRight: 12,/, "marginRight: 10,");
content = content.replace(/gap: 12,/, "gap: 8,");
content = content.replace(/marginHorizontal: 8,/, "marginHorizontal: 6,");

fs.writeFileSync(file, content);
console.log("SUCCESS");
