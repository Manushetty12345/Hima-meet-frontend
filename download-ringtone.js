const fs = require('fs');
const https = require('https');
const path = require('path');

const targetDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'raw');
const targetFile = path.join(targetDir, 'ringtone.mp3');

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// A real notification sound from an open source project (Wix React Native Notifications example)
const fileUrl = 'https://raw.githubusercontent.com/wix/react-native-notifications/master/example/android/app/src/main/res/raw/notification.mp3';

console.log('Downloading ringtone...');
const file = fs.createWriteStream(targetFile);

https.get(fileUrl, function(response) {
  if (response.statusCode === 200) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log('✅ Ringtone successfully downloaded to:', targetFile);
    });
  } else {
    console.log('Failed to download file. Status Code:', response.statusCode);
  }
}).on('error', function(err) {
  fs.unlink(targetFile, () => {});
  console.log('Error downloading file:', err.message);
});
