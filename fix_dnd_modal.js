const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the centered modal with a bottom sheet modal for DND
const targetJSX = `        <Modal
          visible={showDndModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDndModal(false)}
        >
          <View style={styles.centeredModalOverlay}>
            <View style={styles.dndModalContent}>
              <View style={styles.dndModalIconContainer}>
                <BellOff size={30} color="#FF3B5C" />
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

const newJSX = `        <Modal
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

content = content.replace(targetJSX, newJSX);

fs.writeFileSync(file, content);
console.log("DND modal updated to bottom sheet style!");
