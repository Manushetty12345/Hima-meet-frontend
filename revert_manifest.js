const fs = require('fs');
const file = 'android/app/src/main/AndroidManifest.xml';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'android:windowSoftInputMode="adjustPan"',
  'android:windowSoftInputMode="adjustResize"'
);
fs.writeFileSync(file, content);
console.log("Reverted to adjustResize");
