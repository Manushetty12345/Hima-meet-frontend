const fs = require('fs');
const file = 'src/modules/profile/screens/ReferralScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `  const handleShare = async () => {
    if (!stats) return;
    try {
      await Share.share({
        message: stats.share_message,
        title: 'Join Himameet App!',
      });
    } catch (error) {
      // user dismissed
    }
  };`,
  `  const handleShare = async () => {
    Alert.alert('Coming Soon', 'Referral sharing will be implemented in the next version!');
  };`
);

fs.writeFileSync(file, content);
console.log("Replaced Share with Alert!");
