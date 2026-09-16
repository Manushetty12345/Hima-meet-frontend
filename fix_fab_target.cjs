const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add setRandomMatchTarget(undefined) and randomMatchTargetRef.current = undefined to both FAB buttons
content = content.replace(
  /onPress=\{\(\) => \{\s*setRandomMatchType\('audio'\);\s*setShowRandomMatch\(true\);\s*setIsFabExpanded\(false\);\s*\}\}/,
  `onPress={() => {
                setRandomMatchTarget(undefined);
                randomMatchTargetRef.current = undefined;
                setRandomMatchType('audio');
                setShowRandomMatch(true);
                setIsFabExpanded(false);
              }}`
);

content = content.replace(
  /onPress=\{\(\) => \{\s*setRandomMatchType\('video'\);\s*setShowRandomMatch\(true\);\s*setIsFabExpanded\(false\);\s*\}\}/,
  `onPress={() => {
                setRandomMatchTarget(undefined);
                randomMatchTargetRef.current = undefined;
                setRandomMatchType('video');
                setShowRandomMatch(true);
                setIsFabExpanded(false);
              }}`
);

fs.writeFileSync(file, content);
console.log("SUCCESS FAB fix");
