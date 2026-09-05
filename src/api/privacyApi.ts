import apiClient from './apiClient';

export interface DeleteReason {
  id: number;
  reason: string;
}

export const getDeleteReasons = async (): Promise<DeleteReason[]> => {
  try {
    const response = await apiClient.get('/api/user/delete-reasons');
    return response.data?.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reasons');
  }
};

export const deleteAccount = async (reasonId: number, otherReasonText?: string): Promise<void> => {
  try {
    await apiClient.post('/api/user/delete-account', {
      reason_id: reasonId,
      other_reason: otherReasonText,
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};
