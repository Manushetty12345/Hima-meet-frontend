import apiClient, { setAuthToken, clearAuthToken } from '../../../api/apiClient';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface SendOtpResponse {
  status: string;
  message: string;
  data?: { retry_timeout_seconds: number };
}

export interface VerifyOtpResponse {
  status: string;
  message: string;
  data: {
    is_new_user: boolean;
    // Existing user fields
    token?: string;
    user?: {
      id: string;
      role: string;
      name: string;
      phone_number: string;
    };
    // New user fields
    temp_token?: string;
  };
}

// â”€â”€â”€ Send OTP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Backend expects: { country_code: "+91", mobile_number: "9876543210" }

export const sendOtp = async (
  mobile_number: string,
  country_code: string = '+91',
): Promise<SendOtpResponse> => {
  try {
    const response = await apiClient.post('/api/auth/send-otp', {
      country_code,
      mobile_number,
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to send OTP';
    throw new Error(message);
  }
};

// â”€â”€â”€ Verify OTP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Backend expects: { country_code, mobile_number, otp }
// Returns: is_new_user + token (existing) OR temp_token (new)

export const verifyOtp = async (
  mobile_number: string,
  otp: string,
  country_code: string = '+91',
  idToken?: string,
): Promise<VerifyOtpResponse> => {
  try {
    const response = await apiClient.post('/api/auth/verify-otp', {
      country_code,
      mobile_number,
      otp,
      idToken,
    });

    const data: VerifyOtpResponse = response.data;

    // Save full JWT if existing user
    if (!data.data.is_new_user && data.data.token) {
      await setAuthToken(data.data.token);
    }

    // Save temp token if new user (used during onboarding)
    if (data.data.is_new_user && data.data.temp_token) {
      await setAuthToken(data.data.temp_token);
    }

    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'OTP verification failed';
    throw new Error(message);
  }
};

// ─── Check Session ───────────────────────────────────────────────────────────

export interface CheckSessionResponse {
  status: string;
  data: {
    is_new_user: boolean;
    profile_setup_complete?: boolean;
    user?: {
      id: string;
      role: string;
      name: string;
      phone_number: string;
    };
  };
}

export const checkSession = async (): Promise<CheckSessionResponse> => {
  try {
    const response = await apiClient.get('/api/auth/check-session');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Session check failed';
    throw new Error(message);
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const logout = async (): Promise<void> => {
  await clearAuthToken();
};
