const fs = require('fs');
const file = 'src/modules/onboarding/screens/ProfileReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `  topSection: {
    alignItems: 'center',
    paddingTop: 30,`,
  `  topSection: {
    alignItems: 'center',
    paddingTop: 60,`
);

fs.writeFileSync(file, content);
console.log("Done!");
