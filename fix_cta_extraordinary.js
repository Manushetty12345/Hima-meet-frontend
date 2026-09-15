const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add ArrowRight to imports
const t1 = `import { ArrowLeft, User, Sparkles, Pencil, Info, ChevronDown, Check } from 'lucide-react-native';`;
const r1 = `import { ArrowLeft, User, Sparkles, Pencil, Info, ChevronDown, Check, ArrowRight } from 'lucide-react-native';`;

// 2. Replace button JSX with extraordinary design
const t2 = `          <TouchableOpacity
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
          </TouchableOpacity>`;

const r2 = `          <TouchableOpacity
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
              {/* Left decorative line */}
              <View style={styles.ctaDecorLeft} />

              <View style={styles.ctaInner}>
                <Text style={[styles.ctaText, !isContinueEnabled && styles.ctaTextDisabled]}>
                  Continue
                </Text>
                <Text style={[styles.ctaSubText, !isContinueEnabled && styles.ctaTextDisabled]}>
                  {isContinueEnabled ? 'Almost there ?' : 'Fill all fields'}
                </Text>
              </View>

              {/* Arrow badge */}
              <View style={[styles.ctaArrowBadge, !isContinueEnabled && styles.ctaArrowBadgeDisabled]}>
                <ArrowRight size={18} color={isContinueEnabled ? '#1A0733' : '#A79E8C'} />
              </View>

              {/* Right decorative line */}
              <View style={styles.ctaDecorRight} />
            </LinearGradient>
          </TouchableOpacity>`;

// 3. Replace ctaContainer, ctaWrapper, ctaButton, ctaText styles with extraordinary ones
const t3 = `  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: IVORY,
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaButton: {
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
  },`;

const r3 = `  ctaContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    backgroundColor: IVORY,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.15)',
    shadowColor: '#3A0F63',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 12,
  },
  ctaWrapper: {
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: GOLD_DEEP,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaButton: {
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
    backgroundColor: 'rgba(26,7,51,0.25)',
  },
  ctaDecorRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'rgba(26,7,51,0.25)',
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
    color: 'rgba(26,7,51,0.6)',
    marginTop: 1,
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: '#A79E8C',
  },
  ctaArrowBadge: {
    width: 38,
    height: 38,
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
  },`;

let found = true;
if (!content.includes(t1)) { console.log("t1 not found!"); found = false; }
if (!content.includes(t2)) { console.log("t2 not found!"); found = false; }
if (!content.includes(t3)) { console.log("t3 not found!"); found = false; }

if (found) {
  content = content.replace(t1, r1);
  content = content.replace(t2, r2);
  content = content.replace(t3, r3);
  fs.writeFileSync(file, content);
  console.log("All done!");
}
