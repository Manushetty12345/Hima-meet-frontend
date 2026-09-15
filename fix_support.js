const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/support/screens/HelpSupportScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetImports = `import React from 'react';`;
const replaceImports = `import React, { useState, useEffect } from 'react';\nimport { apiClient } from '../../../api/apiClient';\nimport { useIsFocused } from '@react-navigation/native';`;

const targetFunc = `const HelpSupportScreen: React.FC<Props> = ({ navigation }) => {`;
const replaceFunc = `const HelpSupportScreen: React.FC<Props> = ({ navigation }) => {
  const [ticketCount, setTicketCount] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      apiClient.get('/api/support/tickets')
        .then(res => {
          if (res.data && res.data.data) {
            const activeTickets = res.data.data.filter((t: any) => t.status === 'active');
            setTicketCount(activeTickets.length);
          }
        })
        .catch(err => console.error('Failed to load tickets count:', err));
    }
  }, [isFocused]);`;

const targetSubtitle = `<Text style={styles.cardSubtitle}>No ticket raised</Text>`;
const replaceSubtitle = `<Text style={styles.cardSubtitle}>{ticketCount > 0 ? \`\${ticketCount} active ticket\${ticketCount > 1 ? 's' : ''}\` : 'No ticket raised'}</Text>`;

content = content.replace(targetImports, replaceImports);
content = content.replace(targetFunc, replaceFunc);
content = content.replace(targetSubtitle, replaceSubtitle);

fs.writeFileSync(file, content);
console.log("HelpSupportScreen updated.");
