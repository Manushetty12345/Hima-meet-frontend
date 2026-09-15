const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Square button
content = content.replace(
  `  ctaWrapper: {
    borderRadius: 28,`,
  `  ctaWrapper: {
    borderRadius: 0,`
);

// Move up
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

fs.writeFileSync(file, content);
console.log("Done!");
