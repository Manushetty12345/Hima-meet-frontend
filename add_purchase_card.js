const fs = require('fs');
const file = 'src/modules/profile/screens/TransactionsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    const config = getTypeConfig(item.type);
    const Icon = config.icon;

    return (
      <View style={[styles.itemRow, index === 0 && styles.itemRowFirst]}>`;

const replacementStr = `  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    const config = getTypeConfig(item.type);
    const Icon = config.icon;

    // Extraordinary Design for 'purchase'
    if (item.type === 'purchase') {
      return (
        <LinearGradient
          colors={['#FFF8E7', '#FCE9BA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.itemRow, index === 0 && styles.itemRowFirst, styles.extraordinaryPurchaseCard]}
        >
          <View style={styles.purchaseIconGlow}>
            <LinearGradient
              colors={[GOLD, GOLD_DEEP]}
              style={styles.purchaseIconCircle}
            >
              <Coins size={24} color="#FFF" strokeWidth={2} />
            </LinearGradient>
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.purchaseTitle}>Coin Package Purchased</Text>
            <Text style={styles.purchaseDate}>{formatDate(item.timestamp)}</Text>
            <View style={styles.itemStatusRow}>
              <View style={[styles.statusBadge, styles.statusSuccess, { backgroundColor: '#10B98120' }]}>
                <Text style={[styles.statusText, { color: '#059669', fontWeight: '800' }]}>
                  {item.status?.toUpperCase() || 'SUCCESS'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.itemRight}>
            <View style={styles.coinsRow}>
              <Text style={styles.purchaseCoinsText}>
                +{item.coins}
              </Text>
              <Text style={{ fontSize: 13, color: GOLD_DEEP, fontWeight: '800' }}>Coins</Text>
            </View>
            {item.amount_inr != null && item.amount_inr > 0 && (
              <Text style={styles.purchaseAmountText}>Paid ,1{parseFloat(String(item.amount_inr)).toFixed(0)}</Text>
            )}
          </View>
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.itemRow, index === 0 && styles.itemRowFirst]}>`;

content = content.replace(targetStr, replacementStr);

const stylesTargetStr = `  emptyContainer: {`;

const stylesReplacementStr = `  // --- Extraordinary Purchase Card Styles ---
  extraordinaryPurchaseCard: {
    borderWidth: 1.5,
    borderColor: '#F5C54250',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: 4, // Slight pop out effect
    borderRadius: 16,
    paddingVertical: 18,
  },
  purchaseIconGlow: {
    shadowColor: '#F5C542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 14,
  },
  purchaseIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#704705',
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: 12,
    color: '#A17316',
    fontWeight: '600',
    marginBottom: 4,
  },
  purchaseCoinsText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D4AF37',
  },
  purchaseAmountText: {
    fontSize: 13,
    color: '#A17316',
    fontWeight: '700',
    marginTop: 2,
  },

  emptyContainer: {`;

content = content.replace(stylesTargetStr, stylesReplacementStr);

fs.writeFileSync(file, content);
console.log("Extraordinary purchase design added!");
