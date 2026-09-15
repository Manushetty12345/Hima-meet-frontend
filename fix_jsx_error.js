const fs = require('fs');
const file = 'src/modules/onboarding/components/VoiceReader.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the orphaned </Animated.View> closing tag
content = content.replace(
  `              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      )}`,
  `              </TouchableOpacity>
          </View>
        </View>
      )}`
);

fs.writeFileSync(file, content);
console.log("Fixed!");
