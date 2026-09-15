const fs = require('fs');
const file = 'src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('call_blocked_dnd')) {
  // Add state
  content = content.replace(
    `const [showReportModal, setShowReportModal] = useState(false);`,
    `const [showReportModal, setShowReportModal] = useState(false);\n  const [showDndBlockModal, setShowDndBlockModal] = useState(false);\n  const [pendingCallType, setPendingCallType] = useState<'audio'|'video' | null>(null);`
  );

  // Add socket listener
  content = content.replace(
    `localSocket.on('call_busy', (data: any) => {`,
    `localSocket.on('call_blocked_dnd', () => {
              setShowDndBlockModal(true);
            });
            
            localSocket.on('call_busy', (data: any) => {`
  );
  
  content = content.replace(
    `localSocket.off('call_busy');`,
    `localSocket.off('call_blocked_dnd');\n        localSocket.off('call_busy');`
  );
  
  // Save pending call
  content = content.replace(
    `const initiateCall = (type: 'audio' | 'video') => {`,
    `const initiateCall = (type: 'audio' | 'video') => {
    setPendingCallType(type);`
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
                    if (pendingCallType) initiateCall(pendingCallType);
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
      `import { Heart, Search, X, Video, Phone, Star, Shield, Filter, MapPin, Loader2, Play, Crown, Sparkles, Flag, ExternalLink, ChevronRight, Share2, CheckCircle2 } from 'lucide-react-native';`,
      `import { Heart, Search, X, Video, Phone, Star, Shield, Filter, MapPin, Loader2, Play, Crown, Sparkles, Flag, ExternalLink, ChevronRight, Share2, CheckCircle2, BellOff } from 'lucide-react-native';`
    );
  }

  fs.writeFileSync(file, content);
  console.log("CreatorProfileModal updated");
} else {
  console.log("Already updated");
}
