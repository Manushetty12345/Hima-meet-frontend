const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The current code is the bottom sheet. Let's revert it to a centered card, but style it like the Transactions screen.
const targetJSX = `        <Modal
          visible={showDndModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDndModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.logoutModalContent}>
              <Text style={styles.logoutModalTitle}>Turn off Do Not Disturb?</Text>
              <Text style={styles.logoutModalBody}>
                Turning off DND means you'll be available to receive incoming calls from creators right away.
              </Text>
              <View style={styles.logoutModalButtonRow}>
                <TouchableOpacity style={styles.logoutModalCancelBtn} onPress={() => setShowDndModal(false)}>
                  <Text style={styles.logoutModalCancelText}>Keep DND</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.logoutModalButton, { backgroundColor: '#F5C542' }]} 
                  onPress={confirmTurnOffDnd}
                >
                  <Text style={[styles.logoutModalButtonText, { color: '#1A0733' }]}>Turn Off</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>`;

const newJSX = `        <Modal
          visible={showDndModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDndModal(false)}
        >
          <View style={styles.centeredModalOverlay}>
            <View style={styles.dndModalContent}>
              <View style={styles.dndModalIconContainer}>
                <BellOff size={30} color="#D4AF37" />
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
        </Modal>`;

content = content.replace(targetJSX, newJSX);

// Add the centered styles back if they were removed, or update them to match the Transactions styling.
const oldStylesTarget = `  logoutModalButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },`;

const newStyles = `  logoutModalButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  centeredModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dndModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    width: '88%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  dndModalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 197, 66, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dndModalTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#2A1240',
    marginBottom: 12,
    textAlign: 'center',
  },
  dndModalBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#8B7F98',
    marginBottom: 12,
    lineHeight: 22,
    textAlign: 'center',
  },
  dndModalSubBody: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 28,
  },
  dndModalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dndModalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  dndModalCancelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#2A1240',
  },
  dndModalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F5C542',
    alignItems: 'center',
  },
  dndModalConfirmText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#1A0733',
  },`;

content = content.replace(oldStylesTarget, newStyles);

fs.writeFileSync(file, content);
console.log("DND modal restored to center card but with TransactionsScreen styling!");
