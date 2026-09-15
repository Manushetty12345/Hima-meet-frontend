const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `  playbackContainer: {
    width: '100%',
    alignItems: 'center',
  },`,
  `  playbackContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },`
);

fs.writeFileSync(file, content);
console.log("Done!");
