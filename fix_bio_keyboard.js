const fs = require('fs');
const file = 'src/modules/onboarding/screens/CreatorReviewScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `              multiline
              textAlignVertical="top"
              style={styles.bioInput}`;

const replacement = `              keyboardType="default"
              multiline
              textAlignVertical="top"
              style={styles.bioInput}`;

if (!content.includes(target)) {
  console.log("Target not found!");
} else {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Done!");
}
