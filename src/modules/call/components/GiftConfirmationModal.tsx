import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Gift } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GiftConfirmationModalProps {
  visible: boolean;
  gift: { name: string; price: number; icon: string; color: string } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const GiftConfirmationModal: React.FC<GiftConfirmationModalProps> = ({
  visible,
  gift,
  onConfirm,
  onCancel,
}) => {
  if (!gift) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <LinearGradient
            colors={[gift.color || '#5B0E8B', '#2A1240']}
            style={styles.iconCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.emojiIcon}>{gift.icon}</Text>
          </LinearGradient>
          
          <Text style={styles.title}>Send {gift.name}?</Text>
          <Text style={styles.subtitle}>
            This will deduct <Text style={styles.highlight}>{gift.price} coins</Text> from your wallet.
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmWrapper} onPress={onConfirm} activeOpacity={0.7}>
              <LinearGradient
                colors={['#5B0E8B', '#2A1240']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.confirmBtn}
              >
                <Gift size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.confirmText}>Send Gift</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 18, 64, 0.6)', // deep violet dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#FBF6EC', // Ivory theme base
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#EBDFC4',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  emojiIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2A1240',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 15,
    color: '#8B7F98',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  highlight: {
    color: '#D4AF37', // Gold for coins
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#2A1240',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  confirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default GiftConfirmationModal;
