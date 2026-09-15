const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the fixed outer Animated.View wrapper (ctaContainer) and move button into scroll
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
          >
            <LinearGradient
              colors={
                isContinueEnabled
                  ? [GOLD, GOLD_DEEP]
                  : [IVORY_LINE, IVORY_LINE]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text
                style={[
                  styles.ctaText,
                  !isContinueEnabled && styles.ctaTextDisabled,
                ]}
              >
                Continue
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>`;

const newBlock = `        {/* Continue button inside scroll so it scrolls with content */}
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
            >
              <LinearGradient
                colors={
                  isContinueEnabled
                    ? [GOLD, GOLD_DEEP]
                    : [IVORY_LINE, IVORY_LINE]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaButton}
              >
                <Text
                  style={[
                    styles.ctaText,
                    !isContinueEnabled && styles.ctaTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>`;

if (!content.includes(oldBlock)) {
  console.log("Block not found!");
  process.exit(1);
}
content = content.replace(oldBlock, newBlock);

// Also reduce bottomSpacer back to small since button is now inside scroll
content = content.replace(
  `  bottomSpacer: {
    height: 320,
  },`,
  `  bottomSpacer: {
    height: 40,
  },`
);

// Update ctaContainer style - remove shadow/background since it's inline now
content = content.replace(
  `  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 48,
    backgroundColor: IVORY,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },`,
  `  ctaContainer: {
    paddingHorizontal: 0,
    paddingTop: 24,
    paddingBottom: 8,
  },`
);

fs.writeFileSync(file, content);
console.log("Done!");
