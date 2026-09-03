import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the production Render URL
const API_URL = 'https://himameet-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the temp_token for protected routes
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAvatars = async (gender: string) => {
  return api.get(`/onboarding/avatars?gender=${gender}`);
};

export const getLanguages = async () => {
  return api.get('/onboarding/languages');
};

export const getInterests = async () => {
  return api.get('/onboarding/interests');
};

export const saveProfileSetup = async (data: { gender: string, avatar_id: number, language_id: number }) => {
  return api.post('/onboarding/profile-setup', data);
};
