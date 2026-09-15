const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Move tabs before search box, and update tabs to look like chips
const jsxTarget = /\{\(activeTab === 'friends' \|\| activeTab === 'favourite'\) && \(\s*<View style=\{styles\.searchContainer\}>\s*<Search size=\{18\} color="#8B7F98" style=\{styles\.searchIcon\} \/>\s*<TextInput\s*style=\{styles\.searchInput\}\s*placeholder="Search your circle\.\.\."\s*placeholderTextColor="#8B7F98"\s*value=\{searchQuery\}\s*onChangeText=\{setSearchQuery\}\s*\/>\s*<\/View>\s*\)\}\s*<View style=\{styles\.tabRow\}>\s*\{TABS\.map\(\(\{ key, label \}\) => \{\s*const isActive = activeTab === key;\s*return \(\s*<TouchableOpacity\s*key=\{key\}\s*style=\{styles\.tabItem\}\s*activeOpacity=\{0\.7\}\s*onPress=\{\(\) => setActiveTab\(key\)\}\s*>\s*<Text style=\{\[styles\.tabLabel, isActive && styles\.tabLabelActive\]\}>\s*\{getTabLabel\(key, label\)\}\s*<\/Text>\s*\{isActive && \(\s*<LinearGradient\s*colors=\{\['#D4AF37', '#F5C542'\]\}\s*start=\{\{ x: 0, y: 0 \}\}\s*end=\{\{ x: 1, y: 0 \}\}\s*style=\{styles\.tabIndicator\}\s*\/>\s*\)\}\s*<\/TouchableOpacity>\s*\);\s*\}\)\}\s*<\/View>/s;

const jsxReplace = `<View style={styles.tabRow}>
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
                placeholder="Search your circle..."
                placeholderTextColor="#8B7F98"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Search size={18} color="#4B5563" />
            </View>
          )}`;

content = content.replace(jsxTarget, jsxReplace);

// 2. Update styles for tabs and search box
const styleTarget = /    tabRow: \{\s*flexDirection: 'row',\s*paddingHorizontal: 24,\s*paddingTop: 4,\s*\},\s*tabItem: \{\s*flexDirection: 'row',\s*alignItems: 'center',\s*marginRight: 28,\s*paddingBottom: 18,\s*\},\s*tabLabel: \{\s*fontSize: 13,\s*fontWeight: '800',\s*color: TEXT_MUTED,\s*letterSpacing: 1\.2,\s*textTransform: 'uppercase',\s*\},\s*tabLabelActive: \{\s*color: '#2A1240',\s*\},\s*tabIndicator: \{\s*position: 'absolute',\s*bottom: 0,\s*left: 0,\s*right: 0,\s*height: 3,\s*borderTopLeftRadius: 3,\s*borderTopRightRadius: 3,\s*\},\s*searchContainer: \{\s*flexDirection: 'row',\s*alignItems: 'center',\s*marginHorizontal: 24,\s*marginBottom: 16,\s*borderWidth: 1\.5,\s*borderColor: 'rgba\(91, 14, 139, 0\.15\)',\s*borderRadius: 14,\s*paddingHorizontal: 16,\s*height: 46,\s*backgroundColor: 'rgba\(255, 255, 255, 0\.8\)',\s*\},\s*searchIcon: \{\s*marginRight: 8,\s*\},\s*searchInput: \{\s*flex: 1,\s*fontSize: 14,\s*color: '#2A1240',\s*fontWeight: '600',\s*\},/s;

const styleReplace = `    tabRow: {
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
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#1A1A2E',
    },`;

content = content.replace(styleTarget, styleReplace);

fs.writeFileSync(file, content);
console.log("Updated FriendsScreen layout to match RecentCallsScreen");
