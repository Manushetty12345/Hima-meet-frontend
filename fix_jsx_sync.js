const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will just use string replacement specifically on the tab mapping logic.
const targetJSX = `        <View style={styles.tabRow}>
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

const replacementJSX = `        <View style={styles.tabRow}>
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

if (content.includes(targetJSX)) {
    content = content.replace(targetJSX, replacementJSX);
    fs.writeFileSync(file, content);
    console.log("SUCCESS: Replaced JSX");
} else {
    // try removing carriage returns just in case
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const normalizedTarget = targetJSX.replace(/\r\n/g, '\n');
    if (normalizedContent.includes(normalizedTarget)) {
        content = normalizedContent.replace(normalizedTarget, replacementJSX.replace(/\r\n/g, '\n'));
        fs.writeFileSync(file, content);
        console.log("SUCCESS: Replaced JSX (with CRLF normalization)");
    } else {
        console.log("FAILED to find JSX");
    }
}
