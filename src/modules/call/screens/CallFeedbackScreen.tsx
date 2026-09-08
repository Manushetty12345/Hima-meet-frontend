import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { X, Star, Heart, UserPlus } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'CallFeedbackScreen'>;

const CallFeedbackScreen: React.FC<Props> = ({ navigation, route }) => {
  const { creatorName = 'Sarika' } = route.params || {};
  const [rating, setRating] = useState(0);
  const [likeText, setLikeText] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    // Navigate back to home or where it came from
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" {...(Platform.OS === 'android' && { backgroundColor: '#121212' })} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#121212', '#2a0a38', '#121212']}
        style={styles.gradientBg}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Close Button */}
        <View style={styles.closeRow}>
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={handleSubmit}
          >
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <Text style={styles.headerTitle}>How was your session with {creatorName}</Text>
        <Text style={styles.headerSubtitle}>Your feedback helps us improve</Text>

        {/* Rating Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rate your experience</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star
                  size={32}
                  color={star <= rating ? '#F4C430' : '#EFEFEF'}
                  fill={star <= rating ? '#F4C430' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Like Input Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitleLeft}>What did you like? (Optional)</Text>
          <TextInput
            style={styles.inputArea}
            multiline
            placeholder="Type here..."
            placeholderTextColor="#A1A1AA"
            value={likeText}
            onChangeText={setLikeText}
          />
        </View>

        {/* Comments Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitleLeft}>Additional Comments (Optional)</Text>
          <TextInput
            style={[styles.inputArea, { minHeight: 80 }]}
            multiline
            placeholder="Share your experience..."
            placeholderTextColor="#A1A1AA"
            value={comments}
            onChangeText={setComments}
            maxLength={100}
          />
          <Text style={styles.charCount}>{comments.length}/100</Text>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionBtnsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Heart size={16} color="#EC1372" />
            <Text style={styles.actionBtnText}>Add to Favourite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <UserPlus size={16} color="#EC1372" />
            <Text style={styles.actionBtnText}>Add Friend</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  gradientBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  closeRow: {
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2A2436',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8A7A9C',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardTitleLeft: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  inputArea: {
    fontSize: 14,
    color: '#333333',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#A1A1AA',
    textAlign: 'right',
    marginTop: 8,
  },
  actionBtnsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EC1372',
  },
  actionBtnText: {
    color: '#EC1372',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
  },
  submitBtn: {
    backgroundColor: '#EC1372',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CallFeedbackScreen;
