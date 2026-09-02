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
import { Mic, ArrowLeft } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import VoiceReader from '../components/VoiceReader';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;
const TOTAL_STEPS = 4;
const CURRENT_STEP = 4; // Assuming this is the final step

type Props = NativeStackScreenProps<AuthStackParamList, 'VoiceVerification'>;

const VoiceVerificationScreen: React.FC<Props> = ({ navigation }) => {
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
      <View style={styles.statusBarSpacer} />

      {/* Header: Back + Progress */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#EC1372" />
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

      {/* Main Content Area */}
      <View style={styles.content}>
        <View style={styles.micCircle}>
          <Mic size={48} color="#FFFFFF" strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Voice Identification</Text>
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
                  navigation.navigate('ProfileReview');
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
    backgroundColor: '#FFFFFF',
  },
  statusBarSpacer: {
    height: STATUSBAR_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressTrack: {
    flex: 1,
    flexDirection: 'row',
    height: 4,
    marginLeft: 16,
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: '#EC1372',
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
    backgroundColor: '#C8105E', // Deep magenta
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 16,
  },
  divider: {
    width: 32,
    height: 2,
    backgroundColor: '#C8105E',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    textAlign: 'center',
    lineHeight: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#FAFAFC', // Slightly off-white grayish
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
});

export default VoiceVerificationScreen;
