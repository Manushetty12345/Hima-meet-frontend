const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `      try {
        await apiClient.post('/api/user/dnd', { enabled: false });
      } catch (error) {`;
const rep1 = `      try {
        await apiClient.post('/api/user/dnd', { enabled: false });
        showToast('Do Not Disturb disabled', <Bell size={18} color="#FFFFFF" style={{ marginRight: 8 }} />);
      } catch (error) {`;
content = content.replace(target1, rep1);

const target2 = `      try {
        const res = await apiClient.post('/api/user/dnd', { enabled: true });
        if (res.data?.dnd_until) {
          setDndUntil(res.data.dnd_until);
        }
      } catch (error) {`;
const rep2 = `      try {
        const res = await apiClient.post('/api/user/dnd', { enabled: true });
        if (res.data?.dnd_until) {
          setDndUntil(res.data.dnd_until);
        }
        showToast('Do Not Disturb enabled', <BellOff size={18} color="#FFFFFF" style={{ marginRight: 8 }} />);
      } catch (error) {`;
content = content.replace(target2, rep2);

fs.writeFileSync(file, content);
console.log("ProfileScreen toggles updated!");
