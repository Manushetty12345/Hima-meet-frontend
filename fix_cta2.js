const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add ArrowRight to imports
content = content.replace(
  `import { ArrowLeft, User, Sparkles, Pencil, Info, ChevronDown, Check } from 'lucide-react-native';`,
  `import { ArrowLeft, User, Sparkles, Pencil, Info, ChevronDown, Check, ArrowRight } from 'lucide-react-native';`
);

// Replace button JSX - use regex to be safe with whitespace
content = content.replace(
  /(<TouchableOpacity\s*\n\s*activeOpacity=\{0\.85\}\s*\n\s*disabled=\{!isContinueEnabled\}\s*\n\s*onPress=\{handleContinue\}\s*\n\s*style=\{styles\.ctaWrapper\}\s*\n\s*>\s*\n\s*<LinearGradient\s*\n\s*colors=\{\s*\n\s*isContinueEnabled\s*\n\s*\? \[GOLD, GOLD_DEEP\]\s*\n\s*: \[IVORY_LINE, IVORY_LINE\]\s*\n\s*\}\s*\n\s*start=\{\{ x: 0, y: 0 \}\}\s*\n\s*end=\{\{ x: 1, y: 0 \}\}\s*\n\s*style=\{styles\.ctaButton\}\s*\n\s*>\s*\n\s*<Text\s*\n\s*style=\{\[\s*\n\s*styles\.ctaText,\s*\n\s*!isContinueEnabled && styles\.ctaTextDisabled,\s*\n\s*\]\}\s*\n\s*>\s*\n\s*Continue\s*\n\s*<\/Text>\s*\n\s*<\/LinearGradient>\s*\n\s*<\/TouchableOpacity>)/,
  `<TouchableOpacity
            activeOpacity={0.85}
            disabled={!isContinueEnabled}
            onPress={handleContinue}
            style={styles.ctaWrapper}
          >
            <LinearGradient
              colors={
                isContinueEnabled
                  ? [GOLD, '#C8971F', GOLD_DEEP]
                  : ['#E8E4DC', '#D5D0C8']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <View style={styles.ctaDecorLeft} />
              <View style={styles.ctaInner}>
                <Text style={[styles.ctaText, !isContinueEnabled && styles.ctaTextDisabled]}>
                  Continue
                </Text>
                <Text style={[styles.ctaSubText, !isContinueEnabled && styles.ctaTextDisabled]}>
                  {isContinueEnabled ? 'Almost there ?' : 'Fill all fields'}
                </Text>
              </View>
              <View style={[styles.ctaArrowBadge, !isContinueEnabled && styles.ctaArrowBadgeDisabled]}>
                <ArrowRight size={18} color={isContinueEnabled ? '#1A0733' : '#A79E8C'} />
              </View>
              <View style={styles.ctaDecorRight} />
            </LinearGradient>
          </TouchableOpacity>`
);

// Replace ctaContainer style
content = content.replace(
  /ctaContainer: \{\s*\n\s*paddingHorizontal: 24,\s*\n\s*paddingTop: 12,\s*\n\s*paddingBottom: 24,\s*\n\s*backgroundColor: IVORY,\s*\n\s*shadowColor: '#3A0F63',\s*\n\s*shadowOffset: \{ width: 0, height: -4 \},\s*\n\s*shadowOpacity: 0\.06,\s*\n\s*shadowRadius: 10,\s*\n\s*elevation: 8,\s*\n\s*\},/,
  `ctaContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 48,
    backgroundColor: IVORY,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.2)',
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 12,
  },`
);

// Replace ctaWrapper style
content = content.replace(
  /ctaWrapper: \{\s*\n\s*borderRadius: 28,\s*\n\s*overflow: 'hidden',\s*\n\s*shadowColor: GOLD_DEEP,\s*\n\s*shadowOffset: \{ width: 0, height: 8 \},\s*\n\s*shadowOpacity: 0\.3,\s*\n\s*shadowRadius: 14,\s*\n\s*elevation: 6,\s*\n\s*\},/,
  `ctaWrapper: {
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },`
);

// Replace ctaButton + ctaText + ctaTextDisabled styles
content = content.replace(
  /ctaButton: \{\s*\n\s*height: 56,\s*\n\s*alignItems: 'center',\s*\n\s*justifyContent: 'center',\s*\n\s*\},\s*\n\s*ctaText: \{\s*\n\s*fontSize: 16,\s*\n\s*fontWeight: '700',\s*\n\s*color: '#1A0733',\s*\n\s*letterSpacing: 0\.3,\s*\n\s*\},\s*\n\s*ctaTextDisabled: \{\s*\n\s*color: '#A79E8C',\s*\n\s*\},/,
  `ctaButton: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'relative',
  },
  ctaDecorLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'rgba(26,7,51,0.22)',
  },
  ctaDecorRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'rgba(26,7,51,0.22)',
  },
  ctaInner: {
    flex: 1,
    paddingLeft: 10,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A0733',
    letterSpacing: 0.5,
  },
  ctaSubText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(26,7,51,0.55)',
    marginTop: 1,
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: '#A79E8C',
  },
  ctaArrowBadge: {
    width: 40,
    height: 40,
    borderRadius: 0,
    backgroundColor: 'rgba(26,7,51,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(26,7,51,0.2)',
  },
  ctaArrowBadgeDisabled: {
    backgroundColor: 'rgba(160,150,140,0.15)',
    borderColor: 'rgba(160,150,140,0.2)',
  },`
);

fs.writeFileSync(file, content);
console.log("Done!");
