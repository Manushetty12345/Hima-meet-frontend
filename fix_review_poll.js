const fs = require('fs');
const file = 'src/modules/onboarding/screens/ProfileReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add checkSession import after the existing import
const importTarget = `import { submitCreatorApplication } from '../api/onboardingApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../../api/apiClient';`;

const importReplacement = `import { submitCreatorApplication } from '../api/onboardingApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../../api/apiClient';
import { checkSession } from '../../auth/api/authApi';`;

// 2. Replace the submit useEffect to also include polling
const submitTarget = `  useEffect(() => {
    // Prevent going back (hardware button or gesture)
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Allow going to dashboard via 'replace' which doesn't trigger 'beforeRemove' in the same way if we intercept it right? 
      // Actually, 'replace' triggers 'beforeRemove' with e.data.action.type === 'REPLACE'.
      // We only want to prevent 'GO_BACK'
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
      }
    });

    const submit = async () => {
      try {
        const params = route.params;
        if (!params || !params.audioUri) {
          // If we arrived here without params (e.g. from SplashScreen checkSession),
          // it means the application is ALREADY submitted and pending!
          setIsSubmitting(false);
          return;
        }
        const response = await submitCreatorApplication(params, params.audioUri || '');
        if (response.data?.status === 'success') {
          if (response.data.data.token) {
            await AsyncStorage.setItem('userToken', response.data.data.token);
              await setAuthToken(response.data.data.token);
            await AsyncStorage.setItem('userRole', 'creator');
          }
          setIsSubmitting(false);
        } else {
          setSubmitError(response.data?.message || 'Submission failed');
          setIsSubmitting(false);
        }
      } catch (err: any) {
        setSubmitError(err.message || 'Network error');
        setIsSubmitting(false);
      }
    };
    submit();
  }, [route.params]);`;

const submitReplacement = `  useEffect(() => {
    // Prevent going back (hardware button or gesture)
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
      }
    });

    const submit = async () => {
      try {
        const params = route.params;
        if (!params || !params.audioUri) {
          // Arrived here from SplashScreen — application already submitted, just show UI
          setIsSubmitting(false);
          return;
        }
        const response = await submitCreatorApplication(params, params.audioUri || '');
        if (response.data?.status === 'success') {
          if (response.data.data.token) {
            await AsyncStorage.setItem('userToken', response.data.data.token);
            await setAuthToken(response.data.data.token);
            await AsyncStorage.setItem('userRole', 'creator');
          }
          setIsSubmitting(false);
        } else {
          setSubmitError(response.data?.message || 'Submission failed');
          setIsSubmitting(false);
        }
      } catch (err: any) {
        setSubmitError(err.message || 'Network error');
        setIsSubmitting(false);
      }
    };
    submit();

    // Poll every 15 seconds to check if admin has approved
    const pollInterval = setInterval(async () => {
      try {
        const res = await checkSession();
        if (res.status === 'success' && res.data?.application_status === 'approved') {
          clearInterval(pollInterval);
          navigation.replace('CreatorDashboard' as any);
        }
      } catch (_) {
        // Silently ignore polling errors
      }
    }, 15000);

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, [route.params]);`;

if (!content.includes(importTarget)) console.log("Import target not found!");
if (!content.includes(submitTarget)) console.log("Submit target not found!");

content = content.replace(importTarget, importReplacement);
content = content.replace(submitTarget, submitReplacement);
fs.writeFileSync(file, content);
console.log("Done!");
