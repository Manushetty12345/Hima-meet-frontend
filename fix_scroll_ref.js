const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add scrollRef after existing refs
const t1 = `  const ctaOpacity = useRef(new Animated.Value(0)).current;`;
const r1 = `  const scrollRef = useRef<any>(null);
  const ctaOpacity = useRef(new Animated.Value(0)).current;`;

// 2. When bio is focused, manually scroll to end so bio is visible above keyboard
const t2 = `              onFocus={() => setIsBioFocused(true)}`;
const r2 = `              onFocus={() => {
                setIsBioFocused(true);
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}`;

// 3. Add ref to ScrollView
const t3 = `      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >`;
const r3 = `      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >`;

if (!content.includes(t1)) console.log("t1 not found!");
if (!content.includes(t2)) console.log("t2 not found!");
if (!content.includes(t3)) console.log("t3 not found!");

content = content.replace(t1, r1);
content = content.replace(t2, r2);
content = content.replace(t3, r3);
fs.writeFileSync(file, content);
console.log("Done!");
