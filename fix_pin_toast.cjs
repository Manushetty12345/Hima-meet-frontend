const fs = require('fs');

// 1. Update FriendsScreen.tsx colors
let fsContent = fs.readFileSync('D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx', 'utf8');

fsContent = fsContent.replace(
  "backgroundColor: '#E1BEE7', // Pale light purple",
  "backgroundColor: '#EFDFFB', // Matches friends screen header background"
);

fsContent = fsContent.replace(
  "color: '#4A148C', // Dark purple text for contrast",
  "color: '#2A1240', // TEXT_PLUM to match header"
);

fs.writeFileSync('D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx', fsContent);
console.log("SUCCESS FRIENDSSCREEN");

// 2. Update FriendCard.tsx to handle pinning
let fcContent = fs.readFileSync('D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx', 'utf8');

if (!fcContent.includes("const [isPinned, setIsPinned] = useState(false);")) {
  fcContent = fcContent.replace(
    "const [isMuted, setIsMuted] = useState(false);",
    "const [isMuted, setIsMuted] = useState(false);\n  const [isPinned, setIsPinned] = useState(false);"
  );
}

if (!fcContent.includes("const togglePin = () =>")) {
  const togglePinFunc = `
    const togglePin = () => {
      const newPinnedState = !isPinned;
      setIsPinned(newPinnedState);
      if (newPinnedState) {
        onShowToast('Chat pinned', 'info', false);
      } else {
        onShowToast('Chat unpinned', 'info', false);
      }
    };\n`;
    
  fcContent = fcContent.replace(
    "const handleAudioCall = () => {",
    togglePinFunc + "\n  const handleAudioCall = () => {"
  );
}

fcContent = fcContent.replace(
  /<TouchableOpacity style=\{styles\.topIconBtn\}>\s*<Pin size=\{14\} color="#FF1493" fill="#FF1493" \/>\s*<\/TouchableOpacity>/g,
  `<TouchableOpacity onPress={togglePin} style={styles.topIconBtn}>
              <Pin size={14} color={isPinned ? "#FF1493" : "#6B7280"} fill={isPinned ? "#FF1493" : "transparent"} />
            </TouchableOpacity>`
);

fs.writeFileSync('D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx', fcContent);
console.log("SUCCESS FRIENDCARD");
