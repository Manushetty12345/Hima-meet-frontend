const fs = require('fs');

function fixCancel(path) {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Check if handleCancelIncoming is missing but socket.on('cancel_incoming_call', handleCancelIncoming) exists
    if (!content.includes("const handleCancelIncoming =")) {
        content = content.replace("const handleAvailabilityChanged = (payload: any) => {", "const handleCancelIncoming = (data: any) => {};\n      const handleAvailabilityChanged = (payload: any) => {");
        fs.writeFileSync(path, content, 'utf8');
        console.log("Added handleCancelIncoming to " + path);
    } else {
        console.log("handleCancelIncoming already exists in " + path);
    }
}

fixCancel('d:\\App6\\hima-meet-frontend\\src\\modules\\home\\screens\\HomeScreen.tsx');
