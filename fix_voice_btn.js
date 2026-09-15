const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove ripple rings from JSX (the two animated ripple views)
content = content.replace(
  `            <Animated.View style={[styles.rippleRing, rippleStyle(ripple1)]} />
            <Animated.View style={[styles.rippleRing, rippleStyle(ripple2)]} />
            `,
  ``
);

// 2. Remove the Animated.View scale wrapper around start button, keep just TouchableOpacity
content = content.replace(
  `              <Animated.View style={{ width: '100%', transform: [{ scale: startBtnScale }] }}>
                <TouchableOpacity
                  style={styles.startRecordingWrapper}
                  activeOpacity={0.9}
                  onPressIn={() => {
                    pressScale(startBtnScale, 0.97);
                    handleStartRecording();
                  }}
                  onPressOut={() => pressScale(startBtnScale, 1)}
                >`,
  `              <TouchableOpacity
                  style={styles.startRecordingWrapper}
                  activeOpacity={0.9}
                  onPress={handleStartRecording}
                >`
);

// Close tag fix - remove extra </Animated.View> after </TouchableOpacity> for startBtn
content = content.replace(
  /(<\/TouchableOpacity>\s*\n\s*<\/Animated\.View>\s*\n\s*<\/View>\s*\n\s*\}\)\s*\}\s*\n\s*\{recordingState)/,
  `</TouchableOpacity>
            </View>
          }
        }
        {recordingState`
);

// 3. Make start recording button square (borderRadius: 0)
content = content.replace(
  `  startRecordingWrapper: {
    width: '100%',
    borderRadius: 28,`,
  `  startRecordingWrapper: {
    width: '100%',
    borderRadius: 0,`
);

// 4. Remove ripple ring style (not needed anymore)
content = content.replace(
  `  rippleRing: {
    position: 'absolute',
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: GOLD_DEEP,
  },`,
  ``
);

// 5. Move button up by reducing tipCard marginBottom
content = content.replace(
  `    marginBottom: 40,`,
  `    marginBottom: 20,`
);

fs.writeFileSync(file, content);
console.log("Done!");
