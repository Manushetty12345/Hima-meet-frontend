const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/support/screens/HelpSupportScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { apiClient } from '../../../api/apiClient';", "import apiClient from '../../../api/apiClient';");
content = content.replace(".then(res => {", ".then((res: any) => {");
content = content.replace(".catch(err => console", ".catch((err: any) => console");

fs.writeFileSync(file, content);
console.log("Fixed HelpSupportScreen typescript errors");
