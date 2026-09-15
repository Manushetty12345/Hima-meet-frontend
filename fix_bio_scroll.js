const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add scrollRef - find the first useRef in the component
const t1 = `  const ctaOpacity = useRef(new Animated.Value(0)).current;`;
const r1 = `  const scrollRef = useRef<any>(null);
  const ctaOpacity = useRef(new Animated.Value(0)).current;`;

// 2. Add ref to the main ScrollView (not the modal one)
const t2 = `      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >`;
const r2 = `      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >`;

// 3. Add onFocus to bio TextInput to scroll to end
const t3 = `            multiline
            textAlignVertical="top"
            style={styles.bioInput}`;
const r3 = `            keyboardType="default"
            onFocus={() => {
              setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
              }, 150);
            }}
            multiline
            textAlignVertical="top"
            style={styles.bioInput}`;

// 4. Increase bottomSpacer so bio field + button are both scrollable above keyboard
const t4 = `  bottomSpacer: {
    height: 90,
  },`;
const r4 = `  bottomSpacer: {
    height: 200,
  },`;

let found = true;
if (!content.includes(t1)) { console.log("t1 not found!"); found = false; }
if (!content.includes(t2)) { console.log("t2 not found!"); found = false; }
if (!content.includes(t3)) { console.log("t3 not found!"); found = false; }
if (!content.includes(t4)) { console.log("t4 not found!"); found = false; }

if (found) {
  content = content.replace(t1, r1);
  content = content.replace(t2, r2);
  content = content.replace(t3, r3);
  content = content.replace(t4, r4);
  fs.writeFileSync(file, content);
  console.log("All done!");
}
