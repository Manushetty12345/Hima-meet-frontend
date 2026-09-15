const fs = require('fs');
const file = 'src/modules/wallet/screens/WalletScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change borderRadius to 0
content = content.replace(
  `  ctaWrapper: {
    borderRadius: 28,`,
  `  ctaWrapper: {
    borderRadius: 0,`
);

// Push button higher up
content = content.replace(
  `  ctaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 14,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,`,
  `  ctaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,`
);

fs.writeFileSync(file, content);
console.log("Done!");
