const fs = require('fs');
const file = 'src/api/apiClient.ts';
let content = fs.readFileSync(file, 'utf8');

// The original interceptor:
// apiClient.interceptors.response.use(
//   response => response,
//   async error => {
//     if (error.response?.status === 401) {
//       await clearAuthToken();
//       // TODO: You can dispatch a logout action or navigate to LoginScreen here
//     }
//     return Promise.reject(error);
//   },
// );

// First, make sure Alert is imported if needed. It might be easier to just use Alert from react-native.
if (!content.includes('import { Alert } from \'react-native\';')) {
  content = `import { Alert } from 'react-native';\n` + content;
}

const targetInterceptor = `apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await clearAuthToken();
      // TODO: You can dispatch a logout action or navigate to LoginScreen here
    }
    return Promise.reject(error);
  },
);`;

const newInterceptor = `apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await clearAuthToken();
    }
    // Handle specific ACCOUNT_BANNED 403 error
    if (error.response?.status === 403 && error.response?.data?.message === 'ACCOUNT_BANNED') {
      await clearAuthToken();
      Alert.alert(
        'Account Banned',
        'Your account has been banned by an administrator due to severe violations of our community guidelines. You have been automatically logged out.',
        [{ text: 'OK' }]
      );
    }
    return Promise.reject(error);
  },
);`;

content = content.replace(targetInterceptor, newInterceptor);
fs.writeFileSync(file, content);
console.log("apiClient.ts updated to handle bans!");
