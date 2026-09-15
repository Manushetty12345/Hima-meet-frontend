const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the RECORDING state UI
const oldRecordingState = `      {/* RECORDING STATE */}
      {recordingState === 'RECORDING' && (
        <View style={styles.recordingContainer}>
          <View style={styles.recordGlowOuter} />
          <Pressable onPressOut={handleStopRecording}>
            <Animated.View style={{ transform: [{ scale: recordPulse }] }}>
              <LinearGradient
                colors={[PLUM_ROYAL, PLUM_DEEP]}
                style={styles.recordingCircle}
              >
                <View style={styles.recordDot} />
                <Mic size={30} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
            </Animated.View>
          </Pressable>

          <Text style={styles.recordTimeText}>{recordTime.split('.')[0] || recordTime}</Text>

          <View style={styles.equalizerRow}>
            {[bar1, bar2, bar3, bar4, bar5].map((b, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.equalizerBar,
                  {
                    height: b.interpolate({ inputRange: [0, 1], outputRange: [6, 28] }),
                  },
                ]}
              />
            ))}
          </View>

          <Text style={styles.releaseHint}>Release to stop</Text>
        </View>
      )}`;

const newRecordingState = `      {/* RECORDING STATE */}
      {recordingState === 'RECORDING' && (
        <View style={styles.recordingContainer}>
          <Pressable onPressOut={handleStopRecording}>
            <LinearGradient
              colors={[PLUM_ROYAL, PLUM_DEEP]}
              style={styles.recordingCircle}
            >
              <Mic size={30} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </Pressable>
        </View>
      )}`;

content = content.replace(oldRecordingState, newRecordingState);

fs.writeFileSync(file, content);
console.log("Done!");
