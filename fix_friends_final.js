const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The JSX currently looks like:
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
const styleRegex = /headerGradient: \{[\s\S]*?searchInput: \{[\s\S]*?\}/;
const newStyles = `headerGradient: {
    overflow: 'hidden',
    paddingBottom: 0,
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 4,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  headerSubtitle: {
    fontSize: 13.5,
    color: TEXT_MUTED,
  },
  tabRow: {
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
  tabBadge: {
    marginLeft: 7,
    minWidth: 21,
    height: 21,
    borderRadius: 10.5,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 127, 152, 0.16)',
  },
  tabBadgeActive: {
    backgroundColor: GOLD_DEEP,
  },
  tabBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: TEXT_MUTED,
  },
  tabBadgeTextActive: {
    color: '#2A1240',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 14,
    height: 4,
    borderRadius: 2,
  },
  listFlex: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
  },
  emptyTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
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
    marginTop: 12,
    marginBottom: 12,
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
console.log("Re-applied UI changes using Regex (with reduced paddings)");
