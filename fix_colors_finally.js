const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace icon background
content = content.replace(
  /dndModalIconContainer: {[\s\S]*?},/,
  `dndModalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 197, 66, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },`
);

// Replace confirm button background
content = content.replace(
  /dndModalConfirmBtn: {[\s\S]*?},/,
  `dndModalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F5C542',
    alignItems: 'center',
  },`
);

// Replace confirm button text
content = content.replace(
  /dndModalConfirmText: {[\s\S]*?},/,
  `dndModalConfirmText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#1A0733',
  },`
);

// Replace cancel button
content = content.replace(
  /dndModalCancelBtn: {[\s\S]*?},/,
  `dndModalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },`
);

// Replace title color
content = content.replace(
  /dndModalTitle: {[\s\S]*?},/,
  `dndModalTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#2A1240',
    marginBottom: 12,
    textAlign: 'center',
  },`
);

// Replace SubBody color (the "You'll be available" text)
content = content.replace(
  /dndModalSubBody: {[\s\S]*?},/,
  `dndModalSubBody: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 28,
  },`
);

// Also need to fix the JSX icon color if it's still FF3B5C!
content = content.replace(/<BellOff size={30} color="#FF3B5C" \/>/, `<BellOff size={30} color="#D4AF37" />`);

fs.writeFileSync(file, content);
console.log("Colors successfully swapped!");
