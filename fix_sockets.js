const fs = require('fs');

function fixFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Fix adding listeners
    content = content.replace(/socket\.off\('([^']+)'\)\.on\('\1',\s*([^)]+)\);/g, "socket.on($1, $2);");
    
    // Fix cancel_incoming_call block
    content = content.replace(/socket\.off\('cancel_incoming_call'\)\.on\('cancel_incoming_call',\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\}\);/g, "const handleCancelIncoming = ($1) => {$2};\n      socket.on('cancel_incoming_call', handleCancelIncoming);");
    
    // Fix removing listeners
    content = content.replace(/socket\.off\('call_busy'\);[\s\S]*?socket\.off\('call_accepted'\);/g, "socket.off('call_busy', handleCallBusy);\n          socket.off('call_declined', handleCallDeclined);\n          socket.off('call_blocked_insufficient_coins', handleInsufficientCoins);\n          socket.off('call_accepted', handleCallAccepted);");
    
    // Also for user_offline, etc in HomeScreen
    content = content.replace(/socket\.off\('user_offline'\);[\s\S]*?socket\.off\('availability_changed'\);/g, "socket.off('user_offline', handleUserOffline);\n          socket.off('user_online', handleUserOnline);\n          socket.off('availability_changed', handleAvailabilityChanged);\n          socket.off('cancel_incoming_call', handleCancelIncoming);");

    fs.writeFileSync(path, content, 'utf8');
}

fixFile('d:\\App6\\hima-meet-frontend\\src\\modules\\home\\screens\\HomeScreen.tsx');
fixFile('d:\\App6\\hima-meet-frontend\\src\\modules\\friends\\screens\\FriendsScreen.tsx');
