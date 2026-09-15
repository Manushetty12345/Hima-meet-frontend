const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/home/components/ReportUserModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /padding: 24,/,
  "padding: 24,\n    paddingBottom: Platform.OS === 'ios' ? 44 : 36,"
);

fs.writeFileSync(file, content);
console.log("SUCCESS");
