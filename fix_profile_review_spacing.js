const fs = require('fs');
const file = 'src/modules/onboarding/screens/ProfileReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `  topSection: {
    alignItems: 'center',
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,`,
  `  topSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,`
);

fs.writeFileSync(file, content);
console.log("Done!");
