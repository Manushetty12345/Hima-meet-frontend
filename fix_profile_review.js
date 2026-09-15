const fs = require('fs');
const file = 'src/modules/onboarding/screens/ProfileReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Top Bar (Dashboard Icon)
const topBarRegex = /\s*\{\/\* Dashboard Icon at Top Right \*\/\}\s*<View style=\{styles\.topBar\}>\s*<TouchableOpacity\s*style=\{styles\.dashboardBtn\}[\s\S]*?<\/TouchableOpacity>\s*<\/View>/;
content = content.replace(topBarRegex, '');

// 2. Remove all Animated logic and refs
const animRefsRegex = /\s*const hourglassRotate = useRef[\s\S]*?const stepFades = \[step1Fade, step2Fade, step3Fade\];/;
content = content.replace(animRefsRegex, '');

// 3. Remove Animated tags and style props for animations
// contentOpacity, contentTranslateY
content = content.replace(
  /<Animated\.View\s*style=\{\[\s*styles\.body,\s*\{\s*opacity: contentOpacity,\s*transform: \[\{ translateY: contentTranslateY \}\],\s*\},\s*\]\}\s*>/,
  `<View style={styles.body}>`
);

// statusPill
content = content.replace(
  /<Animated\.View\s*style=\{\[\s*styles\.statusPill,\s*\{\s*backgroundColor: statusBg,\s*borderColor: statusBorder,\s*opacity: statusPillOpacity,\s*transform: \[\{ scale: statusPillScale \}\],\s*\},\s*\]\}\s*>/,
  `<View style={[styles.statusPill, { backgroundColor: statusBg, borderColor: statusBorder }]}>`
);

// dotOpacity
content = content.replace(
  /<Animated\.Text\s*style=\{\[\s*styles\.processingDots,\s*\{\s*opacity: dotOpacity,\s*color: statusColor\s*\}\s*\]\}\s*>/,
  `<Text style={[styles.processingDots, { color: statusColor }]}>`
);
content = content.replace(/<\/Animated\.Text>/g, `</Text>`);

// cardEntrance
content = content.replace(
  /<Animated\.View\s*style=\{\[\s*styles\.card,\s*\{\s*transform: \[\{ translateY: cardEntrance \}\]\s*\}\s*\]\}\s*>/,
  `<View style={styles.card}>`
);

// stepRow fades
content = content.replace(
  /<Animated\.View\s*key=\{step\.key\}\s*style=\{\[\s*styles\.stepRow,\s*isLast && styles\.stepRowLast,\s*\{\s*opacity: stepFades\[index\]\s*\},?\s*\]\}\s*>/,
  `<View key={step.key} style={[styles.stepRow, isLast && styles.stepRowLast]}>`
);

// hourglass
content = content.replace(
  /<Animated\.View\s*style=\{\[\s*styles\.hourglassGlow,\s*\{\s*transform: \[\{ scale: glowPulse \}\]\s*\}\s*\]\}\s*\/>/,
  `<View style={styles.hourglassGlow} />`
);
content = content.replace(
  /<Animated\.View style=\{\{\s*transform: \[\{\s*rotate: rotateInterpolate\s*\}\]\s*\}\}>/,
  `<View>`
);

// 4. Change remaining </Animated.View> to </View>
content = content.replace(/<\/Animated\.View>/g, `</View>`);

fs.writeFileSync(file, content);
console.log("Done!");
