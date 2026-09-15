const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/api/friendsApi.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /export const getFriends = \(\) => apiClient\.get\('\/api\/friends\/list'\);/,
  `export const getFriends = () => apiClient.get('/api/friends/list?t=' + Date.now());`
);

content = content.replace(
  /export const getFavourites = \(\) => apiClient\.get\('\/api\/friends\/favourites'\);/,
  `export const getFavourites = () => apiClient.get('/api/friends/favourites?t=' + Date.now());`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
