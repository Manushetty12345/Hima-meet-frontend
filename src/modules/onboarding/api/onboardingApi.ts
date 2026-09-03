import apiClient from '../../api/apiClient';

export const getAvatars = async (gender: string) => {
  return apiClient.get(`/api/onboarding/avatars?gender=${gender}`);
};

export const getLanguages = async () => {
  return apiClient.get('/api/onboarding/languages');
};

export const getInterests = async () => {
  return apiClient.get('/api/onboarding/interests');
};

export const saveProfileSetup = async (data: { gender: string, avatar_id: number, language_id: number }) => {
  return apiClient.post('/api/onboarding/profile-setup', data);
};
