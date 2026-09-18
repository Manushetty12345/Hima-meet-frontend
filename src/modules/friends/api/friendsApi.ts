import apiClient from '../../../api/apiClient';

export const getFriends = (page = 1, limit = 20) => apiClient.get(`/api/friends/list?page=${page}&limit=${limit}&t=${Date.now()}`);
export const getFavourites = (page = 1, limit = 20) => apiClient.get(`/api/friends/favourites?page=${page}&limit=${limit}&t=${Date.now()}`);
export const getRequestsReceived = (page = 1, limit = 20) => apiClient.get(`/api/friends/requests/received?page=${page}&limit=${limit}`);
export const getRequestsSent = (page = 1, limit = 20) => apiClient.get(`/api/friends/requests/sent?page=${page}&limit=${limit}`);

export const sendFriendRequest = (userId: number) => 
  apiClient.post('/api/friends/request', { target_user_id: userId });

export const toggleFavourite = (friendId: number, isFavourite: boolean) => 
  apiClient.post(`/api/friends/${friendId}/favourite`, { is_favourite: isFavourite });
