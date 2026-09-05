import apiClient from './apiClient';

export interface ReferralStats {
  invite_code: string;
  total_invites: number;
  coins_per_invite: number;
  total_coins_earned: number;
  share_message: string;
}

export const getReferralStats = async (): Promise<ReferralStats> => {
  const response = await apiClient.get('/api/user/referral');
  return response.data?.data;
};
