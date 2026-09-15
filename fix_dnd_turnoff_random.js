const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTurnOff = `              <TouchableOpacity style={styles.dndTurnOffCallBtn} onPress={() => {
                setShowDndBlockModal(false);
                apiClient.post('/api/user/dnd', { enabled: false }).then(() => {
                  if (pendingCall) initiateCallWithChecks(pendingCall.creator, pendingCall.type);
                });
              }}>`;

const newTurnOff = `              <TouchableOpacity style={styles.dndTurnOffCallBtn} onPress={() => {
                setShowDndBlockModal(false);
                apiClient.post('/api/user/dnd', { enabled: false }).then(() => {
                  if (pendingCall && pendingCall.creator?.id) {
                    // Named creator call
                    initiateCallWithChecks(pendingCall.creator, pendingCall.type);
                  } else if (pendingCall) {
                    // Random match call
                    setRandomMatchTarget(undefined);
                    setRandomMatchType(pendingCall.type);
                    setShowRandomMatch(true);
                  }
                });
              }}>`;

if (content.includes(oldTurnOff)) {
  content = content.replace(oldTurnOff, newTurnOff);
  fs.writeFileSync(file, content);
  console.log("DND Turn off & call updated for random match!");
} else {
  console.log("Target not found");
}
