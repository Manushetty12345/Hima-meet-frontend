const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/navigation/MainBottomTabNavigator.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetImports = `import { Home as HomeIcon, Clock, Users, UserCircle2 } from 'lucide-react-native';`;
const replaceImports = `import { Home as HomeIcon, Clock, Users, UserCircle2 } from 'lucide-react-native';\nimport LinearGradient from 'react-native-linear-gradient';`;

const targetConstants = `const GOLD_DEEP = '#D4AF37';
const TEXT_MUTED = '#8B7F98';
const IVORY_LINE = '#EBDFC4';`;
const replaceConstants = `const GOLD_DEEP = '#D4AF37';
const TEXT_MUTED = '#8B7F98';
const IVORY_LINE = '#EBDFC4';
const PLUM_ROYAL = '#5B0E8B';
const LILAC_WHITE = '#FBF7FF';`;

const targetScreenOptions = `      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: GOLD_DEEP,
        tabBarInactiveTintColor: TEXT_MUTED,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingTop: 14,
          paddingBottom: Platform.OS === 'ios' ? 36 : 24,
          height: Platform.OS === 'ios' ? 100 : 90,
          borderTopWidth: 1,
          borderTopColor: IVORY_LINE,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ color }) => {
          if (route.name === 'Home') return <HomeIcon size={28} color={color} />;
          if (route.name === 'Recent') return <Clock size={28} color={color} />;
          if (route.name === 'Friends') return <Users size={28} color={color} />;
          if (route.name === 'Profile') return <UserCircle2 size={28} color={color} />;
          return null;
        },
      })}`;

const replaceScreenOptions = `      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: PLUM_ROYAL,
        tabBarInactiveTintColor: TEXT_MUTED,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: LILAC_WHITE,
          paddingTop: 16,
          paddingBottom: Platform.OS === 'ios' ? 38 : 28,
          height: Platform.OS === 'ios' ? 110 : 100,
          borderTopWidth: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          elevation: 15,
          shadowColor: PLUM_ROYAL,
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
        },
        tabBarIcon: ({ focused, color }) => {
          let Icon = HomeIcon;
          if (route.name === 'Recent') Icon = Clock;
          if (route.name === 'Friends') Icon = Users;
          if (route.name === 'Profile') Icon = UserCircle2;

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                height: 48,
                width: 48,
                borderRadius: 24,
                backgroundColor: focused ? 'rgba(91, 14, 139, 0.12)' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: focused ? 1.5 : 0,
                borderColor: focused ? 'rgba(91, 14, 139, 0.3)' : 'transparent',
              }}>
                <Icon size={26} color={focused ? PLUM_ROYAL : TEXT_MUTED} />
              </View>
              {focused && (
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: GOLD_DEEP,
                  marginTop: 6,
                  position: 'absolute',
                  bottom: -12
                }} />
              )}
            </View>
          );
        },
      })}`;

content = content.replace(targetImports, replaceImports);
content = content.replace(targetConstants, replaceConstants);
content = content.replace(targetScreenOptions, replaceScreenOptions);

fs.writeFileSync(file, content);
console.log("Updated MainBottomTabNavigator");
