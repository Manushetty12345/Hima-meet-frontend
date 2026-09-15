const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update FriendItem interface
if (!content.includes('isPinned?: boolean;')) {
  content = content.replace(
    /callAvailable\?: boolean;\s*videoAvailable\?: boolean;\s*\}/,
    "callAvailable?: boolean;\n    videoAvailable?: boolean;\n    isPinned?: boolean;\n  }"
  );
}

// Update useState initial value
content = content.replace(
  /const \[isPinned, setIsPinned\] = useState\(false\);/,
  "const [isPinned, setIsPinned] = useState(item.isPinned || false);"
);

// Update togglePin function
const toggleRegex = /const togglePin = \(\) => \{[\s\S]*?\};\n/;
const newToggle = `const togglePin = async () => {
      const newPinnedState = !isPinned;
      setIsPinned(newPinnedState);
      
      try {
        await apiClient.post(\`/api/friends/\${item.id}/pin\`);
      } catch (err) {
        console.error('Failed to toggle pin', err);
      }

      if (newPinnedState) {
        onShowToast('Chat pinned', 'info', true);
      } else {
        onShowToast('Chat unpinned', 'info', true);
      }
    };\n`;
    
content = content.replace(toggleRegex, newToggle);

fs.writeFileSync(file, content);
console.log("SUCCESS");
