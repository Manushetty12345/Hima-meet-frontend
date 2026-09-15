const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Add missing state declarations near the top of the component
content = content.replace(
  `const [randomMatchTarget, setRandomMatchTarget] = useState<CreatorItem | undefined>(undefined);`,
  `const [randomMatchTarget, setRandomMatchTarget] = useState<CreatorItem | undefined>(undefined);
  const [showDndBlockModal, setShowDndBlockModal] = useState(false);
  const [pendingCall, setPendingCall] = useState<{creator: CreatorItem, type: 'audio'|'video'} | null>(null);`
);

// Fix 2: Fix null -> undefined for setRandomMatchTarget  
content = content.replace(
  `setRandomMatchTarget(null);`,
  `setRandomMatchTarget(undefined);`
);

fs.writeFileSync(file, content);
console.log("HomeScreen state declarations fixed!");
