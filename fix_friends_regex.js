const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The JSX currently looks like:
//         {(activeTab === 'friends' || activeTab === 'favourite') && (
//            <View style={styles.searchContainer}>...
//          <View style={styles.tabRow}>
//            {TABS.map(({ key, label }) => { ...

// We want to completely replace the JSX of the header:
const headerRegex = /<View style=\{styles\.headerRow\}>.*?<\/View>\s*\{\(activeTab === 'friends' \|\| activeTab === 'favourite'\) && \(\s*<View style=\{styles\.searchContainer\}>.*?<\/View>\s*\)\}\s*<View style=\{styles\.tabRow\}>.*?<\/View>/s;

const newHeader = `<View style={styles.headerRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Friends</Text>
              <Text style={styles.headerSubtitle}>Your circle of connections</Text>
            </View>
          </View>

          <View style={styles.tabRow}>
            {TABS.map(({ key, label }) => {
              const isActive = activeTab === key;
              
              if (isActive) {
                return (
                  <TouchableOpacity key={key} activeOpacity={0.85} style={styles.filterChipActive}>
                    <LinearGradient
                      colors={['#D4AF37', '#F5C542']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.filterGrad}
                    >
                      <Text style={styles.filterLabelActive}>{getTabLabel(key, label).toUpperCase()}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={key}
                  style={styles.filterChip}
                  activeOpacity={0.7}
                  onPress={() => setActiveTab(key)}
                >
                  <Text style={styles.filterLabel}>{getTabLabel(key, label).toUpperCase()}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {(activeTab === 'friends' || activeTab === 'favourite') && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                placeholderTextColor="#8B7F98"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Search size={18} color="#4B5563" />
            </View>
          )}`;

content = content.replace(headerRegex, newHeader);


// Now for styles. 
const styleRegex = /tabRow: \{[\s\S]*?searchInput: \{[\s\S]*?\}/;
const newStyles = `tabRow: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      gap: 10,
      marginTop: 8,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: '#EBDFC4',
      backgroundColor: '#FFFFFF',
    },
    filterChipActive: {
      borderRadius: 22,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    filterGrad: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    filterLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: '#5B0E8B',
      letterSpacing: 0.5,
    },
    filterLabelActive: {
      fontSize: 13,
      fontWeight: '700',
      color: '#2A1240',
      letterSpacing: 0.5,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderWidth: 1.5,
      borderColor: '#EBDFC4',
      borderRadius: 14,
      paddingHorizontal: 16,
      height: 48,
      marginHorizontal: 24,
      marginTop: 20,
      marginBottom: 20,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#1A1A2E',
    }`;
content = content.replace(styleRegex, newStyles);

fs.writeFileSync(file, content);
console.log("Re-applied UI changes using Regex");
