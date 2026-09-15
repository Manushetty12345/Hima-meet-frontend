import apiClient from '../../../api/apiClient';

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

export const getVoiceSentence = async () => {
  return apiClient.get('/api/onboarding/voice-sentence');
};


export const submitCreatorApplication = async (data: any, audioUri: string) => {
  const formData = new FormData();
  
  formData.append('gender', data.gender);
  formData.append('avatar_id', String(data.avatar_id));
  formData.append('language_id', String(data.language_id));
  formData.append('age', String(data.age));
  formData.append('bio', data.bio);
  formData.append('interests', JSON.stringify(data.selectedInterests || []));
  
  if (audioUri) {
    const filename = audioUri.split('/').pop() || 'voice_sample.mp4';
    formData.append('voice_sample', {
      uri: audioUri,
      type: 'audio/mp4',
      name: filename,
    } as any);
  }

  return apiClient.post('/api/onboarding/submit-creator-application', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
