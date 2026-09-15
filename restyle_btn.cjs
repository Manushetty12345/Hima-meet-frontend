const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update nameRow marginBottom
content = content.replace(
  /marginBottom: 8,\n\s*gap: 8,/,
  `marginBottom: 4,\n    gap: 8,`
);

// Update chatNowBtn styles
content = content.replace(
  /chatNowBtn: \{\n\s*borderWidth: 1\.5,\n\s*borderColor: '#EC4899',\n\s*borderRadius: 20,\n\s*paddingVertical: 6,\n\s*paddingHorizontal: 14,\n\s*alignSelf: 'flex-start',\n\s*backgroundColor: '#FFFFFF',\n\s*\},\n\s*chatNowText: \{\n\s*color: '#EC4899',\n\s*fontSize: 12,\n\s*fontWeight: '600',\n\s*\}/,
  `chatNowBtn: {
    borderWidth: 1,
    borderColor: '#E91E63',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  chatNowText: {
    color: '#E91E63',
    fontSize: 12,
    fontWeight: '500',
  }`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
