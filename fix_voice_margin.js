const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `  instructionText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 24,
  },`,
  `  instructionText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 12,
  },`
);

fs.writeFileSync(file, content);
console.log("Done!");
