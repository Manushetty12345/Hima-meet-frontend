import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Mic, ArrowLeft } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import VoiceReader from '../components/VoiceReader';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
const TOTAL_STEPS = 4;
const CURRENT_STEP = 4; // Assuming this is the final step

type Props = NativeStackScreenProps<AuthStackParamList, 'VoiceVerification'>;

// ---- Palette pulled from the Himameet mark ----
const PLUM_ROYAL = '#5B0E8B';
const PLUM_DEEP = '#3D0A63';
const GOLD = '#F5C542';
const GOLD_DEEP = '#D4AF37';
const IVORY = '#FBF6EC';
const IVORY_LINE = '#EBDFC4';
const TEXT_PLUM = '#2A1240';
const TEXT_MUTED = '#8B7F98';

// Light lavender header wash — matches every other screen in the app
const LILAC_WHITE = '#FBF7FF';
const LILAC_PALE = '#EFDFFB';

const VoiceVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { gender, avatar_id, language_id } = route.params || {};
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useEffect(() => {
    // Show the bottom sheet after 2 seconds as requested
    const timer = setTimeout(() => {
      setShowBottomSheet(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={[LILAC_WHITE, LILAC_PALE]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.statusBarSpacer} />

        {/* Header: Back + Progress */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color={PLUM_ROYAL} />
          </TouchableOpacity>

          <View style={styles.progressTrack}>
            {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  index < CURRENT_STEP && styles.progressSegmentActive,
                ]}
              />
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <View style={styles.content}>
        <LinearGradient colors={[PLUM_ROYAL, PLUM_DEEP]} style={styles.micCircle}>
          <Mic size={48} color="#FFFFFF" strokeWidth={1.5} />
        </LinearGradient>

        <Text style={styles.title}>Voice identification</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>
          To confirm your identity, please record yourself saying the following sentence
        </Text>
      </View>

      {/* Overlay & Bottom Sheet */}
      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.overlay}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.dragHandle} />
            <VoiceReader
              onSubmit={() => {
                // Handle submit logic here later
                console.log('Submit voice recording');
                setShowBottomSheet(false);
                setTimeout(() => {
                  navigation.navigate('ProfileReview', { gender, avatar_id, language_id });
                }, 150);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IVORY,
  },
  headerGradient: {
    overflow: 'hidden',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 14, 139, 0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(91, 14, 139, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  progressTrack: {
    flex: 1,
    flexDirection: 'row',
    height: 6,
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: GOLD_DEEP,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  micCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: PLUM_ROYAL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_PLUM,
    marginBottom: 16,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  divider: {
    width: 32,
    height: 2,
    backgroundColor: GOLD_DEEP,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 18, 64, 0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: IVORY,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderColor: IVORY_LINE,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: IVORY_LINE,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
});

export default VoiceVerificationScreen;