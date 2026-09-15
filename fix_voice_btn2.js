const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the Animated.View wrapper + onPressIn/Out with simple version
content = content.replace(
  /<Animated\.View style=\{\{ width: '100%', transform: \[\{ scale: startBtnScale \}\] \}\}>\s*<TouchableOpacity\s*style=\{styles\.startRecordingWrapper\}\s*activeOpacity=\{0\.9\}\s*onPressIn=\{\(\) => \{\s*pressScale\(startBtnScale, 0\.97\);\s*handleStartRecording\(\);\s*\}\}\s*onPressOut=\{\(\) => pressScale\(startBtnScale, 1\)\}\s*>/,
  `<TouchableOpacity
                style={styles.startRecordingWrapper}
                activeOpacity={0.85}
                onPress={handleStartRecording}
              >`
);

// Remove extra closing Animated.View tag after the button TouchableOpacity closing tag
// Find pattern: </TouchableOpacity> </Animated.View> </View>  (for the buttonWrapper section)
content = content.replace(
  /(<\/TouchableOpacity>)\s*\n(\s*<\/Animated\.View>)\s*\n(\s*<\/View>\s*\n\s*\}\)\s*\n\s*\}\s*\n\s*\{recordingState === 'RECORDING')/,
  `$1\n$3`
);

fs.writeFileSync(file, content);
console.log("Done!");
