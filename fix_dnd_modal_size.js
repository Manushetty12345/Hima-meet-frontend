const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// ===== Fix 1: Make the DND Modal card bigger =====
// Increase padding and title font size
content = content.replace(
  `  dndModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
  },`,
  `  dndModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },`
);

content = content.replace(
  `  dndModalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1a1a25',
    marginBottom: 12,
    textAlign: 'center',
  },`,
  `  dndModalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1a1a25',
    marginBottom: 12,
    textAlign: 'center',
  },`
);

content = content.replace(
  `  dndModalBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },`,
  `  dndModalBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },`
);

content = content.replace(
  `  dndModalSubBody: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#FF3B5C',
    textAlign: 'center',
    marginBottom: 24,
  },`,
  `  dndModalSubBody: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FF3B5C',
    textAlign: 'center',
    marginBottom: 28,
  },`
);

content = content.replace(
  `  dndModalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 59, 92, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },`,
  `  dndModalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 59, 92, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },`
);

// Increase button sizes
content = content.replace(
  `  dndModalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },`,
  `  dndModalCancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },`
);

content = content.replace(
  `  dndModalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FF3B5C',
    alignItems: 'center',
  },`,
  `  dndModalConfirmBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#FF3B5C',
    alignItems: 'center',
  },`
);

// ===== Fix 2: Fix dnd icon size in modal =====
content = content.replace(
  `<BellOff size={24} color="#FF3B5C" />`,
  `<BellOff size={30} color="#FF3B5C" />`
);

fs.writeFileSync(file, content);
console.log("ProfileScreen DND modal made bigger!");
