const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Extract searchContainer JSX and remove it from listFlex
const searchJsxRegex = /\{\(activeTab === 'friends' \|\| activeTab === 'favourite'\) && \(\s*<View style=\{styles\.searchContainer\}>\s*<Search size=\{18\} color="#9CA3AF" style=\{styles\.searchIcon\} \/>\s*<TextInput\s*style=\{styles\.searchInput\}\s*placeholder="Search by name"\s*placeholderTextColor="#9CA3AF"\s*value=\{searchQuery\}\s*onChangeText=\{setSearchQuery\}\s*\/>\s*<\/View>\s*\)\}/;
content = content.replace(searchJsxRegex, '');

// 2. Insert searchContainer JSX into headerGradient, between headerRow and tabRow
const tabRowTarget = `<View style={styles.tabRow}>`;
const tabRowReplace = `{(activeTab === 'friends' || activeTab === 'favourite') && (
            <View style={styles.searchContainer}>
              <Search size={18} color="#8B7F98" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your circle..."
                placeholderTextColor="#8B7F98"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}
          <View style={styles.tabRow}>`;
content = content.replace(tabRowTarget, tabRowReplace);

// 3. Update active tab gradient (remove pink)
const activeGradientTarget = `<LinearGradient
                      colors={['#FF1493', '#C850C0']}
                      start={{ x: 0, y: 0 }}`;
const activeGradientReplace = `<LinearGradient
                      colors={['#D4AF37', '#F5C542']}
                      start={{ x: 0, y: 0 }}`;
content = content.replace(activeGradientTarget, activeGradientReplace);

// 4. Update tab label to uppercase and change active color
const tabLabelTarget = `    tabLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: TEXT_MUTED,
      letterSpacing: 0.3,
    },
    tabLabelActive: {
      color: '#1A1A2E',
    },`;
const tabLabelReplace = `    tabLabel: {
      fontSize: 13,
      fontWeight: '800',
      color: TEXT_MUTED,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    tabLabelActive: {
      color: '#2A1240',
    },`;
content = content.replace(tabLabelTarget, tabLabelReplace);

// 5. Update searchContainer style (remove pink border, fit header)
const searchStyleTarget = `    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#FF1493',
      borderRadius: 24,
      paddingHorizontal: 16,
      height: 44,
      backgroundColor: '#FFFFFF',
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#1A1A2E',
    },`;
const searchStyleReplace = `    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 24,
      marginBottom: 16,
      borderWidth: 1.5,
      borderColor: 'rgba(91, 14, 139, 0.15)',
      borderRadius: 14,
      paddingHorizontal: 16,
      height: 46,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#2A1240',
      fontWeight: '600',
    },`;
content = content.replace(searchStyleTarget, searchStyleReplace);

// 6. Ensure headerRow padding is optimized since search box is there now
const headerRowTarget = `    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 18,
    },`;
const headerRowReplace = `    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 16,
    },`;
content = content.replace(headerRowTarget, headerRowReplace);

fs.writeFileSync(file, content);
console.log("Updated FriendsScreen header and search bar");
