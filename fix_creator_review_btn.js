const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Make button square
const t1 = `  ctaWrapper: {
    borderRadius: 28,`;
const r1 = `  ctaWrapper: {
    borderRadius: 0,`;

// Move button up by increasing paddingBottom on the container
const t2 = `  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,`;
const r2 = `  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 48,`;

if (!content.includes(t1)) console.log("ctaWrapper not found!");
if (!content.includes(t2)) console.log("ctaContainer not found!");

content = content.replace(t1, r1);
content = content.replace(t2, r2);
fs.writeFileSync(file, content);
console.log("Done!");
