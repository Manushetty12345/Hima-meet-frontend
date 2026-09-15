const fs = require('fs');
const file = 'src/modules/home/components/RandomMatchModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add BellOff import
content = content.replace(
  `import { ChevronsUp } from 'lucide-react-native';`,
  `import { ChevronsUp, BellOff } from 'lucide-react-native';`
);

// 2. Add dndBlocking state
content = content.replace(
  `  const [statusText, setStatusText] = useState('Connecting');`,
  `  const [statusText, setStatusText] = useState('Connecting');
  const [showDndBlock, setShowDndBlock] = useState(false);`
);

// 3. Add DND check at the start of the visible=true block
content = content.replace(
  `    if (visible) {
      setStatusText('Connecting');
      // Dots animation`,
  `    if (visible) {
      setShowDndBlock(false);
      setStatusText('Connecting');
      // Dots animation`
);

// 4. Add DND check before running match logic (in the useEffect after animation setup)
const oldMatchStart = `      if (targetUser) {
        // Direct call, no roaming
        setDisplayAvatar(targetUser.avatarUri);
        setStatusText('Request Sent');
      } else {
        // Random Match Mode - Roaming Animation & API Call
        runRandomMatchLogic();
      }`;

const newMatchStart = `      // Check DND first
      apiClient.get('/api/user/me').then(res => {
        if (res.data?.data?.dnd_enabled) {
          setShowDndBlock(true);
          return;
        }
        if (targetUser) {
          setDisplayAvatar(targetUser.avatarUri);
          setStatusText('Request Sent');
        } else {
          runRandomMatchLogic();
        }
      }).catch(() => {
        // If check fails, proceed normally
        if (targetUser) {
          setDisplayAvatar(targetUser.avatarUri);
          setStatusText('Request Sent');
        } else {
          runRandomMatchLogic();
        }
      });`;

content = content.replace(oldMatchStart, newMatchStart);

// 5. Add DND block overlay INSIDE the modal JSX (before the SafeAreaView closing)
const oldCancelButton = `          {/* Footer */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>`;

const newCancelButton = `          {/* DND Block Overlay - shown inside the modal */}
          {showDndBlock && (
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100,
            }}>
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 28,
                padding: 32,
                width: '85%',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 24,
                elevation: 10,
              }}>
                <View style={{
                  width: 64, height: 64, borderRadius: 32,
                  backgroundColor: 'rgba(255,59,92,0.1)',
                  justifyContent: 'center', alignItems: 'center', marginBottom: 20,
                }}>
                  <BellOff size={30} color="#FF3B5C" />
                </View>
                <Text style={{
                  fontFamily: 'Inter-Bold', fontSize: 20, color: '#1a1a25',
                  marginBottom: 10, textAlign: 'center', fontWeight: '700',
                }}>Do Not Disturb is on</Text>
                <Text style={{
                  fontSize: 15, color: '#666',
                  textAlign: 'center', marginBottom: 28, lineHeight: 22,
                }}>Turn off DND to place this call.</Text>

                <TouchableOpacity
                  style={{
                    width: '100%', paddingVertical: 16, borderRadius: 14,
                    backgroundColor: '#FF3B5C', alignItems: 'center', marginBottom: 12,
                  }}
                  onPress={() => {
                    apiClient.post('/api/user/dnd', { enabled: false }).then(() => {
                      setShowDndBlock(false);
                      if (targetUser) {
                        setDisplayAvatar(targetUser.avatarUri);
                        setStatusText('Request Sent');
                      } else {
                        runRandomMatchLogic();
                      }
                    });
                  }}
                >
                  <Text style={{ fontSize: 15, color: '#FFFFFF', fontWeight: '700' }}>
                    Turn off & call
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ width: '100%', paddingVertical: 14, alignItems: 'center' }}
                  onPress={onClose}
                >
                  <Text style={{ fontSize: 15, color: '#666', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>`;

content = content.replace(oldCancelButton, newCancelButton);

fs.writeFileSync(file, content);
console.log("RandomMatchModal updated with internal DND check!");
