const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/screens/CreatorFullProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace toastContainer
content = content.replace(
  /toastContainer: \{\s*position: 'absolute',\s*bottom: 50,\s*alignSelf: 'center',\s*elevation: 8,\s*zIndex: 999,\s*\}/,
  `toastContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 160 : 140,
    alignSelf: 'center',
    backgroundColor: '#EFDFFB',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 9999,
  }`
);

// Replace toastText
content = content.replace(
  /toastText: \{\s*color: '#333',\s*fontSize: 14,\s*fontWeight: '600',\s*\}/,
  `toastText: {
    color: '#2A1240',
    fontSize: 13,
    fontWeight: '600',
  }`
);

// We should also make sure toastTextError is added if needed, but not strictly required.
fs.writeFileSync(file, content);
console.log("SUCCESS");
