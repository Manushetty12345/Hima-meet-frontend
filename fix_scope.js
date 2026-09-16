const fs = require('fs');

function fixScope(path) {
    let content = fs.readFileSync(path, 'utf8');

    const regex = /const setupListeners = async \(\) => \{\r?\n\s*if \(\!socket\) \{\r?\n\s*socket = await initSocket\(\);\r?\n\s*\}\r?\n\s*if \(\!socket\) return;/;
    
    const match = content.match(regex);
    if (match) {
        // Remove it from the top
        content = content.replace(regex, "");
        
        // Add it back right above socket.on('call_busy'
        content = content.replace(/(\s*)(socket\.on\('call_busy')/g, "$1" + match[0] + "$1$2");
        fs.writeFileSync(path, content, 'utf8');
        console.log("Fixed " + path);
    } else {
        console.log("Could not find header in " + path);
    }
}

fixScope('d:\\App6\\hima-meet-frontend\\src\\modules\\home\\screens\\HomeScreen.tsx');
fixScope('d:\\App6\\hima-meet-frontend\\src\\modules\\friends\\screens\\FriendsScreen.tsx');
