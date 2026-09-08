import apiClient from '../../../api/apiClient';

export const getCallHistory = () => apiClient.get('/api/calls/history');
