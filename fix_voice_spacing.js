const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

// Reduce sentenceCard padding and margin
content = content.replace(
  `  sentenceCard: {
    width: '100%',
    backgroundColor: LILAC_PALE,
    borderRadius: 20,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 16,`,
  `  sentenceCard: {
    width: '100%',
    backgroundColor: LILAC_PALE,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 8,`
);

// Reduce tipCard marginBottom and padding
content = content.replace(
  `  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F6EFDD',
    borderRadius: 14,
    padding: 16,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: IVORY_LINE,
    alignItems: 'center',
    marginBottom: 20,`,
  `  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F6EFDD',
    borderRadius: 14,
    padding: 12,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: IVORY_LINE,
    alignItems: 'center',
    marginBottom: 12,`
);

fs.writeFileSync(file, content);
console.log("Done!");
