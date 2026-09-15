const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove ArrowRight from imports
content = content.replace(
  `import { ArrowLeft, User, Sparkles, Pencil, Info, ChevronDown, Check, ArrowRight } from 'lucide-react-native';`,
  `import { ArrowLeft, User, Sparkles, Pencil, Info, ChevronDown, Check } from 'lucide-react-native';`
);

// 2. Restore original button JSX - replace the fancy one with simple one
content = content.replace(
  /(<TouchableOpacity\s*\n\s*activeOpacity=\{0\.85\}\s*\n\s*disabled=\{!isContinueEnabled\}\s*\n\s*onPress=\{handleContinue\}\s*\n\s*style=\{styles\.ctaWrapper\}\s*\n\s*>)[\s\S]*?(<\/TouchableOpacity>)(\s*\n\s*<\/Animated\.View>)/,
  `<TouchableOpacity
            activeOpacity={0.85}
            disabled={!isContinueEnabled}
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
          </TouchableOpacity>$3`
);

// 3. Restore original ctaContainer
content = content.replace(
  /ctaContainer: \{[\s\S]*?elevation: 12,\s*\n\s*\},/,
  `ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: IVORY,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },`
);

// 4. Restore original ctaWrapper
content = content.replace(
  /ctaWrapper: \{\s*\n\s*borderRadius: 0,\s*\n\s*overflow: 'hidden',\s*\n\s*shadowColor: GOLD_DEEP,\s*\n\s*shadowOffset: \{ width: 0, height: 10 \},\s*\n\s*shadowOpacity: 0\.45,\s*\n\s*shadowRadius: 16,\s*\n\s*elevation: 10,\s*\n\s*\},/,
  `ctaWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },`
);

// 5. Remove all the fancy new styles and restore simple ones
content = content.replace(
  /ctaButton: \{[\s\S]*?ctaArrowBadgeDisabled: \{[\s\S]*?\},/,
  `ctaButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A0733',
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: '#A79E8C',
  },`
);

fs.writeFileSync(file, content);
console.log("Reverted to original button!");
