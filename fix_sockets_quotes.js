const fs = require('fs');

function fixFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    content = content.replace(/socket\.on\(call_busy,\s*([^)]+)\);/g, "socket.on('call_busy', $1);");
    content = content.replace(/socket\.on\(call_declined,\s*([^)]+)\);/g, "socket.on('call_declined', $1);");
    content = content.replace(/socket\.on\(call_blocked_insufficient_coins,\s*([^)]+)\);/g, "socket.on('call_blocked_insufficient_coins', $1);");
    content = content.replace(/socket\.on\(call_accepted,\s*([^)]+)\);/g, "socket.on('call_accepted', $1);");
    content = content.replace(/socket\.on\(user_offline,\s*([^)]+)\);/g, "socket.on('user_offline', $1);");
    content = content.replace(/socket\.on\(user_online,\s*([^)]+)\);/g, "socket.on('user_online', $1);");
    content = content.replace(/socket\.on\(availability_changed,\s*([^)]+)\);/g, "socket.on('availability_changed', $1);");

    fs.writeFileSync(path, content, 'utf8');
}

fixFile('d:\\App6\\hima-meet-frontend\\src\\modules\\home\\screens\\HomeScreen.tsx');
fixFile('d:\\App6\\hima-meet-frontend\\src\\modules\\friends\\screens\\FriendsScreen.tsx');
