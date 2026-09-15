const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const t1 = `    try {
      await apiClient.post('/api/user/dnd', { enabled: false });
    } catch (error) {`;
const r1 = `    try {
      await apiClient.post('/api/user/dnd', { enabled: false });
      showToast('Do Not Disturb disabled', <Bell size={18} color="#FFFFFF" style={{ marginRight: 8 }} />);
    } catch (error) {`;

const t2 = `    try {
      const res = await apiClient.post('/api/user/dnd', { enabled: true });
      if (res.data?.dnd_until) {
        setDndUntil(res.data.dnd_until);
      }
    } catch (error) {`;
const r2 = `    try {
      const res = await apiClient.post('/api/user/dnd', { enabled: true });
      if (res.data?.dnd_until) {
        setDndUntil(res.data.dnd_until);
      }
      showToast('Do Not Disturb enabled', <BellOff size={18} color="#FFFFFF" style={{ marginRight: 8 }} />);
    } catch (error) {`;

content = content.replace(t1, r1);
content = content.replace(t2, r2);

fs.writeFileSync(file, content);
console.log("Updated!");
