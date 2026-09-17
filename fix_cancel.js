const fs = require('fs');

function fixCancel(path) {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Move handleCancelIncoming up
    const handleAvailability = "const handleAvailabilityChanged = (payload: any) => {";
    if (content.includes("const handleCancelIncoming = (data) => {")) {
        content = content.replace(/const handleCancelIncoming = \(data\) => \{[\s\S]*?\};/g, "");
        content = content.replace(/const handleAvailabilityChanged = \(payload: any\) => \{/, "const handleCancelIncoming = (data: any) => {};\n      const handleAvailabilityChanged = (payload: any) => {");
        fs.writeFileSync(path, content, 'utf8');
        console.log("Fixed handleCancelIncoming in " + path);
    }
}

fixCancel('d:\\App6\\hima-meet-frontend\\src\\modules\\home\\screens\\HomeScreen.tsx');
