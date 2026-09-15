const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Restore call rate
content = content.replace(
  /\{\(isOnline && creator\.callAvailable\) \? null : \(/,
  `{(isOnline && creator.callAvailable) ? (
                <View style={styles.rateContainer}>
                  <View style={styles.coinBadge}>
                    <Text style={styles.coinBadgeText}>H</Text>
                  </View>
                  <Text style={styles.rateText}>{Math.round(Number(creator.callRate)) || 20}/min</Text>
                </View>
              ) : (`
);

// Restore video rate
content = content.replace(
  /\{\(isOnline && creator\.videoAvailable\) \? null : \(/,
  `{(isOnline && creator.videoAvailable) ? (
                <View style={styles.rateContainer}>
                  <View style={styles.coinBadge}>
                    <Text style={styles.coinBadgeText}>H</Text>
                  </View>
                  <Text style={styles.rateText}>{Math.round(Number(creator.videoRate)) || 40}/min</Text>
                </View>
              ) : (`
);

// Add the styles
const stylesToAdd = `
    rateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    coinBadge: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#FBC02D',
      alignItems: 'center',
      justifyContent: 'center',
    },
    coinBadgeText: {
      fontSize: 7,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
`;

content = content.replace(
  /rateText: \{/,
  `${stylesToAdd}
    rateText: {`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
