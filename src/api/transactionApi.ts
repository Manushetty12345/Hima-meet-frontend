import apiClient from './apiClient';

export interface Transaction {
  transaction_id: number | string;
  type: string;
  coins: number;
  amount_inr: number | null;
  status: string;
  timestamp: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await apiClient.get('/api/user/transactions');
    return response.data?.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};
