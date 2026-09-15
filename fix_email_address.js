const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/profile/screens/PrivacyPolicyScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetEmail = 'Himaapp000@gmail.com';
const replaceEmail = 'info@hashtocolon.com';

const targetAddress = `                      HashToColon Systems Private Limited,{"\\n"}
                      Indiqube Ascent, Municipal No. 420, PID68-6-420,{"\\n"}
                      IV Block, Koramangala, Bangalore South,{"\\n"}
                      Bangalore - 560034, Karnataka, India.`;
const replaceAddress = `                      HashToColon Systems Private Limited,{"\\n"}
                      No.745, 10th Main, 3rd Block, 3rd Stage Basaveshwara Nagar,{"\\n"}
                      Bangalore, Karnataka, India - 560079`;

content = content.replace(targetEmail, replaceEmail);
content = content.replace(targetAddress, replaceAddress);

fs.writeFileSync(file, content);
console.log("Updated PrivacyPolicyScreen with correct email and address");
