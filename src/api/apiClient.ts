import axios from 'axios';
import Config from 'react-native-config';
import * as Keychain from 'react-native-keychain';

// Reads API_BASE_URL from your .env file.
// For Android emulator use:  http://10.0.2.2:5000
// For physical device use:   http://<YOUR_LOCAL_IP>:5000
// For production use:        https://your-deployed-backend.com
const API_BASE_URL = Config.API_BASE_URL || 'https://himameet-backend.onrender.com';
console.log('[API] Base URL:', API_BASE_URL);

const KEYCHAIN_SERVICE = 'himaMeetAuth';

// ─── Pre-configured Axios instance ───────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s to allow Render cold start
  headers: { 'Content-Type': 'application/json' },
});

// ─── Token Helpers ───────────────────────────────────────────────────────────

/** Call this after a successful login to save the JWT securely on device. */
export const setAuthToken = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword('himaMeetUser', token, {
    service: KEYCHAIN_SERVICE,
  });
};

/** Call this on logout or when the token is invalid. */
export const clearAuthToken = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
};

/** Returns the saved token, or null if not logged in. */
export const getSavedToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
  });
  return credentials ? credentials.password : null;
};

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Automatically attaches the saved JWT to every outgoing request.

apiClient.interceptors.request.use(async config => {
  const credentials = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
  });
  if (credentials) {
    config.headers.Authorization = `Bearer ${credentials.password}`;
  }
  return config;
});

// ─── Response Interceptor ────────────────────────────────────────────────────
// If we get a 401 Unauthorized, clear the token so the app can redirect to login.

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await clearAuthToken();
      // TODO: You can dispatch a logout action or navigate to LoginScreen here
    }
    return Promise.reject(error);
  },
);

export default apiClient;


