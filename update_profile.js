const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add states
content = content.replace(
  `const [dndEnabled, setDndEnabled] = useState(false);`,
  `const [dndEnabled, setDndEnabled] = useState(false);\n  const [dndUntil, setDndUntil] = useState<string | null>(null);\n  const [showDndModal, setShowDndModal] = useState(false);`
);

// 2. Fetch Profile
content = content.replace(
  `setDndEnabled(!!profile.dnd_enabled);`,
  `setDndEnabled(!!profile.dnd_enabled);\n            setDndUntil(profile.dnd_until || null);`
);

// 3. Handle DND Toggle
content = content.replace(
  `const handleDndToggle = async (value: boolean) => {
    // Optimistic update
    setDndEnabled(value);
    try {
      await apiClient.post('/api/user/dnd', { enabled: value });
    } catch (error) {
      console.error('Failed to update DND:', error);
      // Revert if API fails
      setDndEnabled(!value);
    }
  };`,
  `const confirmTurnOffDnd = async () => {
    setShowDndModal(false);
    setDndEnabled(false);
    setDndUntil(null);
    try {
      await apiClient.post('/api/user/dnd', { enabled: false });
    } catch (error) {
      console.error('Failed to update DND:', error);
      setDndEnabled(true); // revert
    }
  };

  const handleDndToggle = async (value: boolean) => {
    if (!value) {
      setShowDndModal(true);
      return;
    }
    
    // Turn ON Optimistically
    setDndEnabled(true);
    try {
      const res = await apiClient.post('/api/user/dnd', { enabled: true });
      if (res.data?.dnd_until) {
        setDndUntil(res.data.dnd_until);
      }
    } catch (error) {
      console.error('Failed to update DND:', error);
      setDndEnabled(false);
    }
  };`
);

// 4. Format DND Until text in the map
content = content.replace(
  `<Text style={styles.settingsTitle}>{item.title}</Text>`,
  `{item.id === 'dnd' && dndEnabled && dndUntil ? (
                      <Text style={styles.settingsTitle}>Do Not Disturb \u2022 Until {new Date(dndUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    ) : (
                      <Text style={styles.settingsTitle}>{item.title}</Text>
                    )}`
);

// 5. Add Modal JSX
const modalJSX = `
      <Modal
        visible={showDndModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDndModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dndModalContent}>
            <View style={styles.dndModalIconContainer}>
              <BellOff size={24} color="#FF3B5C" />
            </View>
            <Text style={styles.dndModalTitle}>Turn off Do Not Disturb?</Text>
            <Text style={styles.dndModalBody}>
              You're in Do Not Disturb. Turning it off means you'll start receiving incoming calls again.
            </Text>
            <Text style={styles.dndModalSubBody}>
              You'll be available to all callers right away.
            </Text>
            <View style={styles.dndModalButtonRow}>
              <TouchableOpacity style={styles.dndModalCancelBtn} onPress={() => setShowDndModal(false)}>
                <Text style={styles.dndModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dndModalConfirmBtn} onPress={confirmTurnOffDnd}>
                <Text style={styles.dndModalConfirmText}>Turn off DND</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
`;

content = content.replace(
  `{/* Logout Bottom Sheet */}`,
  modalJSX + `\n        {/* Logout Bottom Sheet */}`
);

// 6. Add BellOff import if needed
if (!content.includes('BellOff')) {
  content = content.replace(
    `import { ChevronRight, LogOut, ShieldAlert } from 'lucide-react-native';`,
    `import { ChevronRight, LogOut, ShieldAlert, BellOff } from 'lucide-react-native';`
  );
}

// 7. Add Styles
const stylesJSX = `
  dndModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
  },
  dndModalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 59, 92, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dndModalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1a1a25',
    marginBottom: 12,
    textAlign: 'center',
  },
  dndModalBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  dndModalSubBody: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#FF3B5C',
    textAlign: 'center',
    marginBottom: 24,
  },
  dndModalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dndModalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  dndModalCancelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1a1a25',
  },
  dndModalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FF3B5C',
    alignItems: 'center',
  },
  dndModalConfirmText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
`;

content = content.replace(
  `modalOverlay: {`,
  stylesJSX + `\n  modalOverlay: {`
);

fs.writeFileSync(file, content);
console.log("ProfileScreen.tsx updated");
