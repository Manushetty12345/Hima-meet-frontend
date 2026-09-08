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
            <PhoneOff size={24} color="#EC1372" fill="#EC1372" />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FBE9F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A7A9C',
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
    borderColor: '#EFEFEF',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelText: {
    color: '#8A7A9C',
    fontSize: 15,
    fontWeight: '600',
  },
  endButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EC1372',
    alignItems: 'center',
  },
  endText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default EndCallModal;
