const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import BlockUserModal
content = content.replace(
  /import \{ (.*) \} from 'lucide-react-native';/,
  `import { $1 } from 'lucide-react-native';
import BlockUserModal from './BlockUserModal';`
);

// 2. Add state for isBlockModalVisible
content = content.replace(
  /const \[menuVisible, setMenuVisible\] = useState\(false\);/,
  `const [menuVisible, setMenuVisible] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);`
);

// 3. Update handleBlockUser to open modal
content = content.replace(
  /const handleBlockUser = async \(\) => \{[\s\S]*?Alert\.alert\('Error', 'Failed to block user\. Please try again\.'\);\s*\}/,
  `const handleBlockUser = () => {
    setMenuVisible(false);
    setIsBlockModalVisible(true);
  };

  const handleBlockSubmit = async (deleteChat: boolean) => {
    setIsBlockModalVisible(false);
    try {
      await apiClient.post(\`/api/creator/\${creator.id}/block\`, { deleteChat });
      setFriendStatus('blocked');
      disconnectSocket();
      showToast('User blocked');
    } catch (e) {
      console.error('Failed to block user', e);
      Alert.alert('Error', 'Failed to block user. Please try again.');
    }`
);

// 4. Render BlockUserModal before final closing tag of Modal
content = content.replace(
  /<\/KeyboardAvoidingView>\s*<\/View>\s*<\/View>\s*<\/Modal>/,
  `</KeyboardAvoidingView>
          </View>
        </View>
        <BlockUserModal
          visible={isBlockModalVisible}
          onClose={() => setIsBlockModalVisible(false)}
          onBlock={handleBlockSubmit}
        />
      </Modal>`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
