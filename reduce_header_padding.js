const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

let lines = content.replace(/\r\n/g, '\n').split('\n');

// Update headerRow padding
const newHeaderRow = `  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },`;

// Update searchContainer padding
const newSearchContainer = `  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EBDFC4',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 12,
  },`;

// Update headerGradient padding
const newHeaderGradient = `  headerGradient: {
    overflow: 'hidden',
    paddingBottom: 0,
  },`;

lines.splice(607, 12, newSearchContainer); // Lines 608-619
lines.splice(496, 7, newHeaderRow);        // Lines 497-503
lines.splice(489, 4, newHeaderGradient);   // Lines 490-493

fs.writeFileSync(file, lines.join('\n'));
console.log("SUCCESS via line indices spacing");
