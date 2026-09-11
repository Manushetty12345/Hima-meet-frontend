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
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Immersive Blurred Background */}
      <Image 
        source={{ uri: MOCK_CALLEE_AVATAR }} 
        style={[StyleSheet.absoluteFill, { opacity: 0.4 }]} 
        blurRadius={60} 
      />

      {/* LinearGradient Layout Wrapper */}
      <LinearGradient 
        colors={['rgba(18, 10, 30, 0.65)', 'rgba(10, 5, 20, 0.95)', '#000000']} 
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
                <X size={24} color="#FFFFFF" />
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
                        color={star <= rating ? '#FFD700' : 'rgba(255,255,255,0.2)'}
                        fill={star <= rating ? '#FFD700' : 'transparent'}
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
                placeholderTextColor="rgba(255,255,255,0.4)"
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
                placeholderTextColor="rgba(255,255,255,0.4)"
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
                style={[styles.actionBtnGlass, isFavorited && { opacity: 0.85 }]} 
                activeOpacity={0.7}
                onPress={handleAddFavorite}
              >
                <LinearGradient 
                  colors={isFavorited ? ['rgba(255, 0, 122, 0.4)', 'rgba(255, 0, 122, 0.2)'] : ['rgba(255, 0, 122, 0.15)', 'rgba(255, 0, 122, 0.05)']} 
                  style={styles.actionBtnGradient}
                >
                  {isFavorited ? <Check size={18} color="#FFF" /> : <Heart size={18} color="#FF007A" />}
                  <Text style={[styles.actionBtnText, isFavorited && { color: '#FFF' }]}>
                    {isFavorited ? 'Favorited' : 'Add to Favourite'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtnGlass, isFriendRequested && { opacity: 0.85 }]} 
                activeOpacity={0.7}
                onPress={handleAddFriend}
              >
                <LinearGradient 
                  colors={isFriendRequested ? ['rgba(0, 223, 216, 0.4)', 'rgba(0, 223, 216, 0.2)'] : ['rgba(0, 223, 216, 0.15)', 'rgba(0, 223, 216, 0.05)']} 
                  style={styles.actionBtnGradient}
                >
                  {isFriendRequested ? <Check size={18} color="#FFF" /> : <UserPlus size={18} color="#00DFD8" />}
                  <Text style={[styles.actionBtnText, { color: isFriendRequested ? '#FFF' : '#00DFD8' }]}>
                    {isFriendRequested ? 'Request Sent' : 'Add Friend'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit} style={styles.submitWrapper}>
              <LinearGradient 
                colors={['#FF007A', '#EC1372']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.submitBtn}
              >
                <Text style={styles.submitText}>Submit Feedback</Text>
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
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  closeRow: {
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerContainer: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B9AFC4',
    letterSpacing: 0.5,
  },
  highlightName: {
    color: '#00DFD8',
    fontWeight: '700',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  glassCardActive: {
    borderColor: 'rgba(255, 0, 122, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  cardTitleLeft: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EBE5F0',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  starWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    opacity: 0.3,
    transform: [{ scale: 1.5 }],
  },
  inputArea: {
    fontSize: 15,
    color: '#FFFFFF',
    minHeight: 50,
    textAlignVertical: 'top',
    padding: 0,
  },
  charCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'right',
    marginTop: 12,
  },
  actionBtnsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtnGlass: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  actionBtnText: {
    color: '#FF007A',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingTop: 16,
  },
  submitWrapper: {
    shadowColor: '#FF007A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  submitBtn: {
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default CallFeedbackScreen;
