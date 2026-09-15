const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = `      {/* Floating Random Button */}`;

const dndModal = `      {/* DND Block Modal */}
      {showDndBlockModal && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <View style={{
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
              marginBottom: 10, textAlign: 'center',
            }}>Do Not Disturb is on</Text>
            <Text style={{
              fontFamily: 'Inter-Regular', fontSize: 15, color: '#666',
              textAlign: 'center', marginBottom: 28, lineHeight: 22,
            }}>Turn off DND to place this call.</Text>
            
            <TouchableOpacity
              style={{
                width: '100%', paddingVertical: 16, borderRadius: 14,
                backgroundColor: '#FF3B5C', alignItems: 'center', marginBottom: 12,
              }}
              onPress={() => {
                setShowDndBlockModal(false);
                apiClient.post('/api/user/dnd', { enabled: false }).then(() => {
                  if (pendingCall && pendingCall.creator?.id) {
                    initiateCallWithChecks(pendingCall.creator, pendingCall.type);
                  } else if (pendingCall) {
                    setRandomMatchTarget(undefined);
                    setRandomMatchType(pendingCall.type);
                    setShowRandomMatch(true);
                  }
                });
              }}
            >
              <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#FFFFFF' }}>
                Turn off & call
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 14, alignItems: 'center' }}
              onPress={() => setShowDndBlockModal(false)}
            >
              <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#666' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      `;

if (content.includes(anchor)) {
  content = content.replace(anchor, dndModal + anchor);
  fs.writeFileSync(file, content);
  console.log("DND Block Modal inserted into HomeScreen!");
} else {
  console.log("Anchor not found");
}
