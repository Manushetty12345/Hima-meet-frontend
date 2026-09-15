import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AlertCircle } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onRecharge: () => void;
  onClose: () => void;
}

const LowBalanceWarning: React.FC<Props> = ({ visible, onRecharge, onClose }) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient 
          colors={['#FBF7FF', '#EFDFFB']}
          style={styles.container}
        >
          <View style={styles.iconContainer}>
            <AlertCircle size={48} color="#D4AF37" />
          </View>
          
          <Text style={styles.title}>Low Balance Warning</Text>
          <Text style={styles.message}>
            You have less than 1 minute remaining in this call. Please recharge to continue talking.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Dismiss</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rechargeBtnWrapper} onPress={onRecharge}>
              <LinearGradient colors={['#F5C542', '#D4AF37']} style={styles.rechargeBtn}>
                <Text style={styles.rechargeText}>Recharge Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBDFC4', // IVORY_LINE
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.15)', // GOLD transparent
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2A1240', // TEXT_PLUM
    marginBottom: 12,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  message: {
    fontSize: 15,
    color: '#8B7F98', // TEXT_MUTED
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBDFC4',
  },
  cancelText: {
    color: '#8B7F98', // TEXT_MUTED
    fontSize: 15,
    fontWeight: '600',
  },
  rechargeBtnWrapper: {
    flex: 1,
    shadowColor: '#D4AF37', // GOLD_DEEP
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rechargeBtn: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  rechargeText: {
    color: '#2A1240', // TEXT_PLUM
    fontSize: 15,
    fontWeight: '700',
  },
});

export default LowBalanceWarning;
