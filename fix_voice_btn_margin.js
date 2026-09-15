const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add marginBottom to buttonWrapper to push it up
content = content.replace(
  `  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },`,
  `  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 40,
  },`
);

fs.writeFileSync(file, content);
console.log("Done!");
