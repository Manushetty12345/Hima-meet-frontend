const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
});`;

const replacement = `  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PLUM,
  },
  toastContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    alignSelf: 'center',
    backgroundColor: '#2A1240',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 9999,
  },
  toastText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    flexShrink: 1,
  },
});`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Toast styling added!");
} else {
  console.log("Could not find the target to replace styles!");
}
