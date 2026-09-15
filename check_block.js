const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace bottomSpacer + close ScrollView + the fixed button block
// with: button inside scroll + close ScrollView (no fixed button)
const oldBlock = `        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Animated.View
        style={[
          styles.ctaContainer,
          {
            opacity: ctaOpacity,
            transform: [{ translateY: ctaTranslateY }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: ctaBtnScale }] }}>
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!isContinueEnabled}
            onPressIn={() => isContinueEnabled && pressScale(ctaBtnScale, 0.97)}
            onPressOut={() => pressScale(ctaBtnScale, 1)}
            onPress={handleContinue}
            style={styles.ctaWrapper}
          >`;

if (!content.includes(oldBlock)) {
  console.log("Block not found - trying regex approach");
  process.exit(1);
}
console.log("Block found!");
