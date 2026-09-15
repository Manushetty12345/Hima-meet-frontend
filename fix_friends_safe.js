const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// JSX
const oldJSX = `        <View style={styles.tabRow}>
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <TouchableOpacity
                key={key}
                style={styles.tabItem}
                activeOpacity={0.7}
                onPress={() => setActiveTab(key)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {getTabLabel(key, label)}
                </Text>
                {isActive && (
                  <LinearGradient
                    colors={['#FF1493', '#C850C0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tabUnderline}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
        </View>
      ) : (
        <View style={styles.listFlex}>
          {(activeTab === 'friends' || activeTab === 'favourite') && (
            <View style={styles.searchContainer}>
              <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}`;

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
        )}
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={GOLD_DEEP} />
        </View>
      ) : (
        <View style={styles.listFlex}>`;

// Tab styles
const oldTabStyles = `  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 28,
    paddingBottom: 18,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: '#FF1493',
  },`;

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

// Search styles
const oldSearchStyles = `  searchContainer: {
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

if (content.includes(oldJSX) && content.includes(oldTabStyles) && content.includes(oldSearchStyles)) {
  content = content.replace(oldJSX, newJSX);
  content = content.replace(oldTabStyles, newTabStyles);
  content = content.replace(oldSearchStyles, newSearchStyles);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  console.log("FAILED to find exact strings");
  // Check which one failed
  if (!content.includes(oldJSX)) console.log("JSX failed");
  if (!content.includes(oldTabStyles)) console.log("Tab styles failed");
  if (!content.includes(oldSearchStyles)) console.log("Search styles failed");
}
