import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { PhoneOff } from 'lucide-react-native';

interface EndCallModalProps {
  visible: boolean;
  onCancel: () => void;
  onEndCall: () => void;
}

const EndCallModal: React.FC<EndCallModalProps> = ({
  visible,
  onCancel,
  onEndCall,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconCircle}>
            <PhoneOff size={24} color="#5B0E8B" fill="#5B0E8B" />
          </View>
          
          <Text style={styles.title}>End Call?</Text>
          <Text style={styles.subtitle}>Are you sure you want to end this call?</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.endButton} 
              onPress={onEndCall}
              activeOpacity={0.8}
            >
              <Text style={styles.endText}>End call</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FBF6EC', // IVORY
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EBDFC4', // IVORY_LINE
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFDFFB', // LILAC_PALE
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#5B0E8B', // PLUM_ROYAL
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2A1240', // TEXT_PLUM
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7F98', // TEXT_MUTED
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBDFC4',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelText: {
    color: '#8B7F98',
    fontSize: 15,
    fontWeight: '600',
  },
  endButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#5B0E8B', // PLUM_ROYAL
    alignItems: 'center',
    shadowColor: '#5B0E8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  endText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default EndCallModal;
