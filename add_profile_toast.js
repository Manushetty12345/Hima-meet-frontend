const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Animated to react-native imports if not present
if (!content.includes('Animated,')) {
  content = content.replace(
    '  Alert,\n} from \'react-native\';',
    '  Alert,\n  Animated,\n} from \'react-native\';'
  );
}

// 2. Add Bell to lucide imports
if (!content.includes('Bell,')) {
  content = content.replace(
    '  BellOff,\n',
    '  BellOff,\n  Bell,\n'
  );
}

// 3. Add toast states inside ProfileScreen
const stateHookTarget = `  const [isLoggingOut, setIsLoggingOut] = useState(false);`;
const stateHookReplacement = `  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<React.ReactNode>(null);
  const toastOpacity = React.useRef(new Animated.Value(0)).current;

  const showToast = (message: string, icon?: React.ReactNode) => {
    setToastMessage(message);
    setToastIcon(icon || null);
    
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });
  };`;
content = content.replace(stateHookTarget, stateHookReplacement);

// 4. Update DND toggle logic to trigger toasts
const offDndTarget = `      try {
        await apiClient.post('/api/user/dnd', { enabled: false });
      } catch (error) {`;
const offDndReplacement = `      try {
        await apiClient.post('/api/user/dnd', { enabled: false });
        showToast('Do Not Disturb disabled', <Bell size={18} color="#FFFFFF" style={{ marginRight: 8 }} />);
      } catch (error) {`;
content = content.replace(offDndTarget, offDndReplacement);

const onDndTarget = `      try {
        const res = await apiClient.post('/api/user/dnd', { enabled: true });
        if (res.data?.dnd_until) {
          setDndUntil(res.data.dnd_until);
        }
      } catch (error) {`;
const onDndReplacement = `      try {
        const res = await apiClient.post('/api/user/dnd', { enabled: true });
        if (res.data?.dnd_until) {
          setDndUntil(res.data.dnd_until);
        }
        showToast('Do Not Disturb enabled', <BellOff size={18} color="#FFFFFF" style={{ marginRight: 8 }} />);
      } catch (error) {`;
content = content.replace(onDndTarget, onDndReplacement);

// 5. Add Toast JSX
const jsxTarget = `      </ScrollView>
    </View>
  );
};`;
const jsxReplacement = `      </ScrollView>

      {/* Toast */}
      {toastMessage && (
        <Animated.View style={[
          styles.toastContainer, 
          { opacity: toastOpacity }
        ]}>
          {toastIcon}
          <Text style={styles.toastText}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

    </View>
  );
};`;
content = content.replace(jsxTarget, jsxReplacement);

// 6. Add Styles
const styleTarget = `  logoutModalButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});`;
const styleReplacement = `  logoutModalButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
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
content = content.replace(styleTarget, styleReplacement);

fs.writeFileSync(file, content);
console.log("ProfileScreen toast added!");
