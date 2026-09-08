import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Info, Check } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const REPORT_OPTIONS = [
  'Fake profile',
  'Not replying',
  'Abusive behavior',
  'Attitude problem',
  'Asking for personal info',
  'Other',
];

const ReportUserModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) {
      Alert.alert('Validation Error', 'Please select a reason');
      return;
    }
    onSubmit(selectedReason, details);
    setSelectedReason('');
    setDetails('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.handleBar} />
          
          <View style={styles.iconContainer}>
            <Info size={24} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>Report user</Text>
          <Text style={styles.subtitle}>Select a reason and add details if needed.</Text>

          <View style={styles.chipsContainer}>
            {REPORT_OPTIONS.map((opt) => {
              const isSelected = selectedReason === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedReason(opt)}
                >
                  {isSelected && <Check size={14} color="#FFFFFF" style={{ marginRight: 6 }} />}
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedReason === 'Other' && (
            <View style={styles.textAreaContainer}>
              <Text style={styles.textAreaLabel}>Tell us more</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                maxLength={300}
                value={details}
                onChangeText={setDetails}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{details.length}/300</Text>
            </View>
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF1493',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2A1240',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7F98',
    marginBottom: 24,
    textAlign: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F2F8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#FF1493',
  },
  chipText: {
    color: '#8B7F98',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  textAreaContainer: {
    width: '100%',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#FF1493',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#FDF2F6',
    position: 'relative',
  },
  textAreaLabel: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    fontSize: 12,
    color: '#FF1493',
    fontWeight: '600',
    zIndex: 1,
  },
  textArea: {
    height: 80,
    fontSize: 14,
    color: '#2A1240',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#8B7F98',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
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
  submitBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FF1493',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ReportUserModal;
