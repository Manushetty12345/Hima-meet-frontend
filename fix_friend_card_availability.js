const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/components/FriendCard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add properties to FriendItem
content = content.replace(/videoRate\?: number;/, "videoRate?: number;\n  callAvailable?: boolean;\n  videoAvailable?: boolean;");

// 2. Add variables for availability inside FriendCard component
content = content.replace(/const \[isMuted, setIsMuted\] = useState\(false\);/, "const [isMuted, setIsMuted] = useState(false);\n\n  const isAudioAvailable = item.isOnline && item.callAvailable !== false;\n  const isVideoAvailable = item.isOnline && item.videoAvailable !== false;");

// 3. Update handleAudioCall & handleVideoCall
content = content.replace(/if \(!item\.isOnline\)/g, "if (!item.isOnline)");
content = content.replace(/onShowToast\('This user is not available for audio calls right now.', 'error'\);/g, "onShowToast('This user is not available for audio calls right now.', 'error');\n    } else if (item.callAvailable === false) {\n      onShowToast('This user has turned off audio calls.', 'error');");
content = content.replace(/onShowToast\('This user is not available for video calls right now.', 'error'\);/g, "onShowToast('This user is not available for video calls right now.', 'error');\n    } else if (item.videoAvailable === false) {\n      onShowToast('This user has turned off video calls.', 'error');");

// 4. Update the render UI for Audio
const audioRegex = /<TouchableOpacity onPress=\{handleAudioCall\} style=\{\[styles\.callBtn, item\.isOnline && styles\.callBtnOnline\]\}>\s*<Phone size=\{14\} color=\{item\.isOnline \? '#FF1493' : '#9CA3AF'\} fill=\{item\.isOnline \? '#FF1493' : '#9CA3AF'\} \/>\s*<\/TouchableOpacity>\s*\{item\.isOnline \? \([\s\S]*?\) : \(\s*<Text style=\{styles\.offlineText\}>Offline<\/Text>\s*\)\}/;

const newAudio = `<TouchableOpacity onPress={handleAudioCall} style={[styles.callBtn, isAudioAvailable && styles.callBtnOnline]}>
              <Phone size={14} color={isAudioAvailable ? '#FF1493' : '#9CA3AF'} fill={isAudioAvailable ? '#FF1493' : '#9CA3AF'} />
            </TouchableOpacity>
            {isAudioAvailable ? (
              <View style={styles.rateContainer}>
                <View style={styles.coinBadge}>
                  <Text style={styles.coinBadgeText}>H</Text>
                </View>
                <Text style={styles.rateText}>{item.callRate || 20}/min</Text>
              </View>
            ) : (
              <Text style={styles.offlineText}>Offline</Text>
            )}`;

content = content.replace(audioRegex, newAudio);

// 5. Update the render UI for Video
const videoRegex = /<TouchableOpacity onPress=\{handleVideoCall\} style=\{\[styles\.callBtn, item\.isOnline && styles\.callBtnOnline\]\}>\s*<Video size=\{14\} color=\{item\.isOnline \? '#FF1493' : '#9CA3AF'\} fill=\{item\.isOnline \? '#FF1493' : '#9CA3AF'\} \/>\s*<\/TouchableOpacity>\s*\{item\.isOnline \? \([\s\S]*?\) : \(\s*<Text style=\{styles\.offlineText\}>Offline<\/Text>\s*\)\}/;

const newVideo = `<TouchableOpacity onPress={handleVideoCall} style={[styles.callBtn, isVideoAvailable && styles.callBtnOnline]}>
              <Video size={14} color={isVideoAvailable ? '#FF1493' : '#9CA3AF'} fill={isVideoAvailable ? '#FF1493' : '#9CA3AF'} />
            </TouchableOpacity>
            {isVideoAvailable ? (
              <View style={styles.rateContainer}>
                <View style={styles.coinBadge}>
                  <Text style={styles.coinBadgeText}>H</Text>
                </View>
                <Text style={styles.rateText}>{item.videoRate || 40}/min</Text>
              </View>
            ) : (
              <Text style={styles.offlineText}>Offline</Text>
            )}`;

content = content.replace(videoRegex, newVideo);

fs.writeFileSync(file, content);
console.log("SUCCESS");
