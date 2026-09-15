const fs = require('fs');
const file = 'src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('call_blocked_dnd')) {
  // Add state
  content = content.replace(
    `const [showWalletModal, setShowWalletModal] = useState(false);`,
    `const [showWalletModal, setShowWalletModal] = useState(false);\n  const [showDndBlockModal, setShowDndBlockModal] = useState(false);\n  const [pendingCall, setPendingCall] = useState<{creator: any, type: 'audio'|'video'} | null>(null);`
  );

  // Add socket listener
  content = content.replace(
    `socket.off('call_busy').on('call_busy', handleCallBusy);`,
    `socket.off('call_blocked_dnd').on('call_blocked_dnd', () => {
        setShowDndBlockModal(true);
      });
      socket.off('call_busy').on('call_busy', handleCallBusy);`
  );
  
  content = content.replace(
    `socket.off('call_busy');`,
    `socket.off('call_blocked_dnd');\n          socket.off('call_busy');`
  );
  
  // Save pending call
  content = content.replace(
    `const initiateCallWithChecks = async (creator: any, type: 'audio' | 'video') => {`,
    `const initiateCallWithChecks = async (creator: any, type: 'audio' | 'video') => {
      setPendingCall({ creator, type });`
  );

  // Add Modal
  const modalJSX = `
      {/* DND Block Modal */}
      <Modal
        visible={showDndBlockModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDndBlockModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dndModalContent}>
            <View style={styles.dndModalIconContainer}>
              <BellOff size={24} color="#FF3B5C" />
            </View>
            <Text style={styles.dndModalTitle}>Do Not Disturb is on</Text>
            <Text style={styles.dndModalBody}>
              Turn off DND to place this call.
            </Text>
            
            <View style={styles.dndBlockModalButtonContainer}>
              <TouchableOpacity style={styles.dndTurnOffCallBtn} onPress={() => {
                setShowDndBlockModal(false);
                apiClient.post('/api/user/dnd', { enabled: false }).then(() => {
                  if (pendingCall) initiateCallWithChecks(pendingCall.creator, pendingCall.type);
                });
              }}>
                <Text style={styles.dndTurnOffCallText}>Turn off & call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.dndCancelBtn} onPress={() => setShowDndBlockModal(false)}>
                <Text style={styles.dndCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  `;

  content = content.replace(
    `{/* Wallet Verification Modal */}`,
    modalJSX + `\n      {/* Wallet Verification Modal */}`
  );
  
  // Styles
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
    marginBottom: 8,
    textAlign: 'center',
  },
  dndModalBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  dndBlockModalButtonContainer: {
    width: '100%',
    gap: 12,
  },
  dndTurnOffCallBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FF3B5C',
    alignItems: 'center',
  },
  dndTurnOffCallText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  dndCancelBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
  },
  dndCancelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#666',
  },
`;

  content = content.replace(
    `modalOverlay: {`,
    stylesJSX + `\n  modalOverlay: {`
  );

  if (!content.includes('BellOff')) {
    content = content.replace(
      `import { Search, MoreVertical, X, Phone, Video } from 'lucide-react-native';`,
      `import { Search, MoreVertical, X, Phone, Video, BellOff } from 'lucide-react-native';`
    );
  }

  fs.writeFileSync(file, content);
  console.log("FriendsScreen updated");
} else {
  console.log("Already updated");
}
