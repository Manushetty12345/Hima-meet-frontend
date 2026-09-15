import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Platform,
  Image,
  ToastAndroid,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { X, Star, Heart, UserPlus, Send, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../../navigation/AuthNavigator';
import apiClient from '../../../api/apiClient';

type Props = NativeStackScreenProps<AuthStackParamList, 'CallFeedbackScreen'>;

const MOCK_CALLEE_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200';

const CallFeedbackScreen: React.FC<Props> = ({ navigation, route }) => {
  const { creatorName = 'User', creatorId, callId } = route.params || {};
  const [rating, setRating] = useState(0);
  const [likeText, setLikeText] = useState('');
  const [comments, setComments] = useState('');
  const [activeInput, setActiveInput] = useState<'like' | 'comments' | null>(null);
  
  // Action states
  const [isFriendRequested, setIsFriendRequested] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFriend = async () => {
    if (!creatorId) return;
    try {
      if (isFriendRequested) {
        // Cancel the request
        await apiClient.post('/api/friends/cancel', { target_user_id: creatorId });
        setIsFriendRequested(false);
        ToastAndroid.show('Friend request cancelled', ToastAndroid.SHORT);
      } else {
        // Send the request
        await apiClient.post('/api/friends/request', { target_user_id: creatorId });
        setIsFriendRequested(true);
        ToastAndroid.show('Friend request sent!', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    }
  };

  const handleAddFavorite = async () => {
    if (!creatorId) return;
    try {
      if (isFavorited) {
        // Remove from favourites
        await apiClient.post(`/api/friends/${creatorId}/favourite`, { is_favourite: false });
        setIsFavorited(false);
        ToastAndroid.show('Removed from favourites', ToastAndroid.SHORT);
      } else {
        // Add to favourites
        await apiClient.post(`/api/friends/${creatorId}/favourite`, { is_favourite: true });
        setIsFavorited(true);
        ToastAndroid.show('Added to favourites!', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      ToastAndroid.show('Please select a rating', ToastAndroid.SHORT);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await apiClient.post('/api/call/feedback', {
        callId: callId ?? null,
        creatorId: creatorId ?? null,
        rating,
        likeText,
        comments,
      });
      ToastAndroid.show('Feedback submitted successfully!', ToastAndroid.SHORT);
    } catch (error) {
      console.log('Error submitting feedback', error);
      // Still navigate away — don't trap the user on this screen
    } finally {
      navigation.popToTop();
    }
  };

  return (
    <View style={styles.container}>
      {/* @ts-ignore: translucent and backgroundColor are valid Android props but missing from types */}
      {/* @ts-ignore */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Immersive Blurred Background Removed to match Ivory theme */}

      {/* LinearGradient Layout Wrapper */}
      <LinearGradient 
        colors={['#FBF7FF', '#EFDFFB', '#FBF6EC']} 
        style={styles.container} 
      >
        <View style={styles.safeArea}>
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Close Button */}
            <View style={styles.closeRow}>
              <TouchableOpacity 
                style={styles.closeBtn} 
                onPress={handleSubmit}
                activeOpacity={0.7}
              >
                <X size={24} color="#2A1240" />
              </TouchableOpacity>
            </View>

            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>How was your session?</Text>
              <Text style={styles.headerSubtitle}>Leave feedback for <Text style={styles.highlightName}>{creatorName}</Text></Text>
            </View>

            {/* Rating Card */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Rate your experience</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity 
                    key={star} 
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.starWrapper}>
                      {star <= rating && (
                        <View style={styles.starGlow} />
                      )}
                      <Star
                        size={40}
                        color={star <= rating ? '#D4AF37' : 'rgba(42, 18, 64, 0.1)'}
                        fill={star <= rating ? '#D4AF37' : 'transparent'}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Like Input Card */}
            <View style={[styles.glassCard, activeInput === 'like' && styles.glassCardActive]}>
              <Text style={styles.cardTitleLeft}>What did you like? (Optional)</Text>
              <TextInput
                style={styles.inputArea}
                multiline
                placeholder="Type your compliments here..."
                placeholderTextColor="rgba(42, 18, 64, 0.4)"
                value={likeText}
                onChangeText={setLikeText}
                onFocus={() => setActiveInput('like')}
                onBlur={() => setActiveInput(null)}
              />
            </View>

            {/* Comments Card */}
            <View style={[styles.glassCard, activeInput === 'comments' && styles.glassCardActive]}>
              <Text style={styles.cardTitleLeft}>Additional Comments (Optional)</Text>
              <TextInput
                style={[styles.inputArea, { minHeight: 80 }]}
                multiline
                placeholder="Share your experience..."
                placeholderTextColor="rgba(42, 18, 64, 0.4)"
                value={comments}
                onChangeText={setComments}
                maxLength={100}
                onFocus={() => setActiveInput('comments')}
                onBlur={() => setActiveInput(null)}
              />
              <Text style={styles.charCount}>{comments.length}/100</Text>
            </View>

            {/* Action Buttons Row */}
            <View style={styles.actionBtnsRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, isFavorited && styles.actionBtnActive]} 
                activeOpacity={0.7}
                onPress={handleAddFavorite}
              >
                {isFavorited ? <Check size={18} color="#5B0E8B" /> : <Heart size={18} color="#2A1240" />}
                <Text style={[styles.actionBtnText, isFavorited && styles.actionBtnTextActive]}>
                  {isFavorited ? 'Favorited' : 'Add to Favourite'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, isFriendRequested && styles.actionBtnActive]} 
                activeOpacity={0.7}
                onPress={handleAddFriend}
              >
                {isFriendRequested ? <Check size={18} color="#5B0E8B" /> : <UserPlus size={18} color="#2A1240" />}
                <Text style={[styles.actionBtnText, isFriendRequested && styles.actionBtnTextActive]}>
                  {isFriendRequested ? 'Request Sent' : 'Add Friend'}
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} style={styles.submitWrapper}>
              <LinearGradient 
                colors={['#5B0E8B', '#2A1240']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.submitBtnGrad}
              >
                <Text style={styles.submitBtnText}>Submit Feedback</Text>
                <Send size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6EC',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight ?? 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginTop: 10,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2A1240',
    fontFamily: 'PlayfairDisplay-Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8B7F98',
  },
  highlightName: {
    color: '#5B0E8B',
    fontWeight: '700',
  },
  glassCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  glassCardActive: {
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A1240',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardTitleLeft: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A1240',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  starWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starGlow: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
  },
  inputArea: {
    color: '#2A1240',
    fontSize: 15,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#8B7F98',
    marginTop: 8,
  },
  actionBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  actionBtnActive: {
    backgroundColor: 'rgba(91, 14, 139, 0.1)',
    borderColor: '#5B0E8B',
  },
  actionBtnText: {
    color: '#2A1240',
    fontSize: 14,
    fontWeight: '600',
  },
  actionBtnTextActive: {
    color: '#5B0E8B',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingTop: 16,
  },
  submitBtnWrapper: {
    marginTop: 'auto',
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CallFeedbackScreen;
