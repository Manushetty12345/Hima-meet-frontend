import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Zap } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type WelcomeOfferBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onAddCoins: () => void;
  onViewMorePlans: () => void;
  coins?: number;
  originalPrice?: number;
  offerPrice?: number;
  savePercent?: number;
  usedByCount?: number;
};

const WelcomeOfferBottomSheet: React.FC<WelcomeOfferBottomSheetProps> = ({
  visible,
  onClose,
  onAddCoins,
  onViewMorePlans,
  coins = 2500,
  originalPrice = 999,
  offerPrice = 699,
  savePercent = 30,
  usedByCount = 37795,
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
        >
          <View style={styles.dragHandle} />

          <View style={styles.imageWrap}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
              }}
              style={styles.heroImage}
            />
            <View style={styles.limitedOfferBadge}>
              <Zap size={11} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.limitedOfferText}>LIMITED OFFER</Text>
            </View>
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>Your welcome offer</Text>
            <Text style={styles.subtitle}>
              A one-time head start to find your best friend.
            </Text>

            <View style={styles.offerCard}>
              <View style={styles.offerIconCircle}>
                <Text style={styles.offerIconText}>H</Text>
              </View>

              <View style={styles.offerTextBlock}>
                <Text style={styles.offerCoinsText}>
                  {coins.toLocaleString('en-IN')} Coins
                </Text>
                <Text style={styles.offerSubtext}>Best value welcome pack</Text>
              </View>

              <View style={styles.offerPriceBlock}>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>Save {savePercent}%</Text>
                </View>
                <Text style={styles.originalPriceText}>₹{originalPrice}</Text>
                <Text style={styles.offerPriceText}>₹{offerPrice}</Text>
              </View>
            </View>

            <View style={styles.socialProofBanner}>
              <Text style={styles.socialProofText}>
                Used by {usedByCount.toLocaleString('en-IN')} people in the
                last 30 mins
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onAddCoins}
              style={styles.ctaWrapper}
            >
              <LinearGradient
                colors={['#FF3B8D', '#E0116F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaButton}
              >
                <Text style={styles.ctaText}>Add Coins ₹{offerPrice}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onViewMorePlans}
              style={styles.viewMoreButton}
            >
              <Text style={styles.viewMoreText}>View more plans</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 8, 26, 0.55)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    overflow: 'hidden',
  },
  dragHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5DEEF',
    marginTop: 10,
    marginBottom: 12,
  },
  imageWrap: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  limitedOfferBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#22A85E',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  limitedOfferText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A7A9C',
    marginBottom: 18,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1EAF6',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  offerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE9A8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  offerIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#C6912F',
  },
  offerTextBlock: {
    flex: 1,
  },
  offerCoinsText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1B0E22',
    marginBottom: 2,
  },
  offerSubtext: {
    fontSize: 12,
    color: '#8A7A9C',
  },
  offerPriceBlock: {
    alignItems: 'flex-end',
  },
  saveBadge: {
    backgroundColor: '#E5F7EC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22A85E',
  },
  originalPriceText: {
    fontSize: 12,
    color: '#B4A6BE',
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },
  offerPriceText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#EC1372',
  },
  socialProofBanner: {
    backgroundColor: '#F7F5FA',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 18,
  },
  socialProofText: {
    fontSize: 12,
    color: '#6E6178',
    fontWeight: '500',
  },
  ctaWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#E0116F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 14,
  },
  ctaButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  viewMoreText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1B0E22',
  },
});

export default WelcomeOfferBottomSheet;
