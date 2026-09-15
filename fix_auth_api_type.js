const fs = require('fs');
const file = 'src/modules/auth/api/authApi.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `export interface CheckSessionResponse {
  status: string;
  data: {
    is_new_user: boolean;
    profile_setup_complete?: boolean;
    user?: {
      id: string;
      role: string;
      name: string;
      phone_number: string;
    };
  };
}`;

const replacement = `export interface CheckSessionResponse {
  status: string;
  data: {
    is_new_user: boolean;
    profile_setup_complete?: boolean;
    application_status?: string | null;
    user?: {
      id: string;
      role: string;
      name: string;
      phone_number: string;
    };
  };
}`;

if (!content.includes(target)) {
  console.log("Target not found!");
} else {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Done!");
}
