const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings
let lines = content.replace(/\r\n/g, '\n').split('\n');

const newJSX = `        <View style={styles.tabRow}>
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

const newTabStyles = `  tabRow: {
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
  },`;

const newSearchStyles = `  searchContainer: {
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
  },`;

// To safely replace, let's verify line contents first to ensure we don't blind-replace
if (lines[340].includes('styles.tabRow') && lines[515].includes('tabRow:') && lines[607].includes('searchContainer:')) {
  // Replace Chunk 4 first to not shift indices of earlier chunks
  lines.splice(607, 21, newSearchStyles); // lines 608-628 is index 607 to 627 (21 elements)
  lines.splice(515, 49, newTabStyles);    // lines 516-564 is index 515 to 563 (49 elements)
  lines.splice(373, 12, '');              // lines 374-385 is index 373 to 384 (12 elements)
  lines.splice(340, 25, newJSX);          // lines 341-365 is index 340 to 364 (25 elements)
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log("SUCCESS via line indices");
} else {
  console.log("Line indices mismatch");
  console.log("Line 341:", lines[340]);
  console.log("Line 516:", lines[515]);
  console.log("Line 608:", lines[607]);
}
