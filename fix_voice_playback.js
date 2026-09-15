const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Move recording mic up by adding marginBottom to recordingContainer
content = content.replace(
  `  recordingContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },`,
  `  recordingContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    marginBottom: 60,
  },`
);

// 2. Remove timer in playback state
const timeRowRegex = /<View style=\{styles\.timeRow\}>[\s\S]*?<\/View>/;
content = content.replace(timeRowRegex, '');

// 3. Remove Animated scale wrapper for Record Again
content = content.replace(
  /<Animated\.View style=\{\{ width: '100%', transform: \[\{ scale: againBtnScale \}\] \}\}>\s*<TouchableOpacity\s*style=\{styles\.secondaryButton\}\s*activeOpacity=\{0\.85\}\s*onPressIn=\{\(\) => pressScale\(againBtnScale, 0\.97\)\}\s*onPressOut=\{\(\) => pressScale\(againBtnScale, 1\)\}\s*onPress=\{handleRecordAgain\}\s*>/,
  `<TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={handleRecordAgain}
            >`
);

content = content.replace(
  /<\/TouchableOpacity>\s*\n\s*<\/Animated\.View>\s*\n\s*<Animated\.View style=\{\{ width: '100%', transform: \[\{ scale: submitBtnScale \}\] \}\}>\s*<TouchableOpacity\s*style=\{styles\.primaryButtonWrapper\}\s*activeOpacity=\{0\.9\}\s*onPressIn=\{\(\) => pressScale\(submitBtnScale, 0\.97\)\}\s*onPressOut=\{\(\) => pressScale\(submitBtnScale, 1\)\}\s*onPress=\{\(\) => onSubmit\(audioUri\)\}\s*>/,
  `<\/TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButtonWrapper}
              activeOpacity={0.9}
              onPress={() => onSubmit(audioUri)}
            >`
);

content = content.replace(
  /<\/TouchableOpacity>\s*\n\s*<\/Animated\.View>\s*\n\s*<\/View>\s*\n\s*\)\}\s*\n\s*<\/View>/,
  `<\/TouchableOpacity>
          </View>
        )}
      </View>`
);

// 4. Square buttons and reduce spacing
content = content.replace(
  `  secondaryButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },`,
  `  secondaryButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },`
);

content = content.replace(
  `  primaryButtonWrapper: {
    width: '100%',
    borderRadius: 28,`,
  `  primaryButtonWrapper: {
    width: '100%',
    borderRadius: 0,`
);

content = content.replace(
  `    marginBottom: 24,
  },
  sliderCard: {`,
  `    marginBottom: 12,
  },
  sliderCard: {`
);

content = content.replace(
  `  sliderCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    marginBottom: 24,
  },`,
  `  sliderCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: IVORY_LINE,
    marginBottom: 16,
  },`
);

fs.writeFileSync(file, content);
console.log("Done!");
