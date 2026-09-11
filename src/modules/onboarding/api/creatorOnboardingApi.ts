import apiClient from '../../../api/apiClient';

export const submitCreatorApplication = async (data: { age: string, bio: string, interest_names: string[] }) => {
  // We use standard JSON post since we are omitting the voice recording file
  return apiClient.post('/api/creator/application/submit', data);
};
