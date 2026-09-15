const fs = require('fs');
const file = 'src/modules/profile/screens/ProfileScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    </View>
  );
};`;

const replacement = `      {/* Toast */}
      {toastMessage && (
        <Animated.View style={[
          styles.toastContainer, 
          { opacity: toastOpacity }
        ]}>
          {toastIcon}
          <Text style={styles.toastText}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Toast JSX added!");
} else {
  console.log("Could not find the target to replace!");
}
