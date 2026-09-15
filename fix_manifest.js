const fs = require('fs');
const file = 'android/app/src/main/AndroidManifest.xml';
let content = fs.readFileSync(file, 'utf8');

const t1 = `android:windowSoftInputMode="adjustResize"`;
const r1 = `android:windowSoftInputMode="adjustPan"`;

if (!content.includes(t1)) {
  console.log("Not found!");
} else {
  content = content.replace(t1, r1);
  fs.writeFileSync(file, content);
  console.log("Done!");
}
