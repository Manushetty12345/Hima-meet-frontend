import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { X } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onBlock: (deleteChat: boolean) => void;
}

const BlockUserModal: React.FC<Props> = ({ visible, onClose, onBlock }) => {
  const [deleteChat, setDeleteChat] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <X size={24} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>Block User?</Text>
          <Text style={styles.subtitle}>
            Once you block this user, you won't be able to send or receive messages from them. You can unblock them anytime.
          </Text>

          <TouchableOpacity
            style={styles.checkboxRow}
            activeOpacity={0.7}
            onPress={() => setDeleteChat(!deleteChat)}
          >
            <View style={[styles.checkbox, deleteChat && styles.checkboxChecked]}>
              {deleteChat && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Also delete chat for me</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blockBtn} onPress={() => onBlock(deleteChat)}>
              <Text style={styles.blockBtnText}>Block</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF1493',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: -48, // To give that half-outside look if needed, but per screenshot it's inside. Let's adjust to be inside
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2A1240',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7F98',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#8B7F98',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF1493',
    borderColor: '#FF1493',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2A1240',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#8B7F98',
    fontSize: 16,
    fontWeight: '700',
  },
  blockBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FF1493',
    alignItems: 'center',
  },
  blockBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BlockUserModal;
