import apiClient from '../../../api/apiClient';

export const getFriends = () => apiClient.get('/api/friends/list');
export const getFavourites = () => apiClient.get('/api/friends/favourites');
export const getRequestsReceived = () => apiClient.get('/api/friends/requests/received');
export const getRequestsSent = () => apiClient.get('/api/friends/requests/sent');

export const sendFriendRequest = (userId: number) => 
  apiClient.post('/api/friends/request', { target_user_id: userId });

export const toggleFavourite = (friendId: number, isFavourite: boolean) => 
  apiClient.post(`/api/friends/${friendId}/favourite`, { is_favourite: isFavourite });
