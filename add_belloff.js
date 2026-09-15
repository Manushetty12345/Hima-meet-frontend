const fs = require('fs');
const file = 'src/modules/home/screens/HomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');
if (!content.includes('BellOff')) {
  content = content.replace(
    `import { Heart, Search, X, Video, Phone, Star, Shield, Filter, MapPin, Loader2, Sparkles, AlertCircle } from 'lucide-react-native';`,
    `import { Heart, Search, X, Video, Phone, Star, Shield, Filter, MapPin, Loader2, Sparkles, AlertCircle, BellOff } from 'lucide-react-native';`
  );
  fs.writeFileSync(file, content);
  console.log("BellOff added!");
} else {
  console.log("BellOff already present");
}
