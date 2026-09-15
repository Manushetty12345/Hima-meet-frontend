const fs = require('fs');
const file = 'src/modules/onboarding/screens/SelectLanguageScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change borderRadius and increase paddingBottom
content = content.replace(
  `  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,`,
  `  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 48,`
);

content = content.replace(
  `  ctaWrapper: {
    borderRadius: 999,`,
  `  ctaWrapper: {
    borderRadius: 0,`
);

fs.writeFileSync(file, content);
console.log("Done!");
