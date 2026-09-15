const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Avatar
content = content.replace(/avatarRing: \{\s*width: 62,\s*height: 62,\s*borderRadius: 31,/, "avatarRing: {\n    width: 50,\n    height: 50,\n    borderRadius: 25,");
content = content.replace(/avatarInner: \{\s*width: 56,\s*height: 56,\s*borderRadius: 28,/, "avatarInner: {\n    width: 46,\n    height: 46,\n    borderRadius: 23,");
content = content.replace(/avatar: \{\s*width: 52,\s*height: 52,\s*borderRadius: 26,/, "avatar: {\n    width: 42,\n    height: 42,\n    borderRadius: 21,");

// Update Text
content = content.replace(/name: \{\s*fontSize: 16,/, "name: {\n    fontSize: 15,");
content = content.replace(/lastMessageText: \{\s*fontSize: 13,/, "lastMessageText: {\n    fontSize: 12,");

// Update Top Icons size 18 -> 16
content = content.replace(/<Pin size=\{18\}/g, "<Pin size={16}");
content = content.replace(/<BellOff size=\{18\}/g, "<BellOff size={16}");
content = content.replace(/<Bell size=\{18\}/g, "<Bell size={16}");

// Update Call Action Button & Icons
content = content.replace(/<Phone size=\{18\}/g, "<Phone size={16}");
content = content.replace(/<Video size=\{18\}/g, "<Video size={16}");
content = content.replace(/callBtn: \{\s*width: 44,\s*height: 44,\s*borderRadius: 22,/, "callBtn: {\n    width: 36,\n    height: 36,\n    borderRadius: 18,");
content = content.replace(/callAction: \{\s*alignItems: 'center',\s*justifyContent: 'center',\s*width: 50,/, "callAction: {\n    alignItems: 'center',\n    justifyContent: 'center',\n    width: 44,");

// Update Coin Badge & Rate Text
content = content.replace(/coinBadge: \{\s*width: 12,\s*height: 12,\s*borderRadius: 6,/, "coinBadge: {\n    width: 10,\n    height: 10,\n    borderRadius: 5,");
content = content.replace(/coinBadgeText: \{\s*fontSize: 8,/, "coinBadgeText: {\n    fontSize: 7,");
content = content.replace(/rateText: \{\s*fontSize: 11,/, "rateText: {\n    fontSize: 10,");
content = content.replace(/offlineText: \{\s*fontSize: 11,/, "offlineText: {\n    fontSize: 10,");

// Update Card Padding & Margins
content = content.replace(/padding: 16,\s*marginBottom: 12,/, "padding: 12,\n    marginBottom: 8,");
content = content.replace(/marginRight: 16,/, "marginRight: 12,");
content = content.replace(/gap: 16,/, "gap: 12,");

fs.writeFileSync(file, content);
console.log("SUCCESS");
