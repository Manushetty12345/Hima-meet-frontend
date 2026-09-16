const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// 1. Update onMatchFound callback to use dynamic rates
content = content.replace(
  /onMatchFound=\{\(creator\) => \{\n\s*\/\/ Construct a partial CreatorItem for the checks\n\s*const mockCreator = \{\n\s*id: creator\.id,\n\s*name: creator\.name,\n\s*avatarUri: creator\.avatarUri,\n\s*callAvailable: true,\n\s*videoAvailable: true,\n\s*callRate: 20,\n\s*videoRate: 40,\n\s*\} as any;/,
  `onMatchFound={(creator: any) => {
            // Construct a partial CreatorItem for the checks
            const mockCreator = {
              id: creator.id,
              name: creator.name,
              avatarUri: creator.avatarUri,
              callAvailable: true,
              videoAvailable: true,
              callRate: creator.callRate || 20,
              videoRate: creator.videoRate || 40,
            } as any;`
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
