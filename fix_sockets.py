import re

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix adding listeners
    content = re.sub(
        r"socket\.off\('([^']+)'\)\.on\('\1', ([^)]+)\);",
        r"socket.on('\1', \2);",
        content
    )
    
    # Fix cancel_incoming_call block
    content = re.sub(
        r"socket\.off\('cancel_incoming_call'\)\.on\('cancel_incoming_call',\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\}\);",
        r"const handleCancelIncoming = (\1) => {\2};\n      socket.on('cancel_incoming_call', handleCancelIncoming);",
        content
    )
    
    # Fix removing listeners
    content = re.sub(
        r"socket\.off\('call_busy'\);[\s\S]*?socket\.off\('call_accepted'\);",
        r"socket.off('call_busy', handleCallBusy);\n          socket.off('call_declined', handleCallDeclined);\n          socket.off('call_blocked_insufficient_coins', handleInsufficientCoins);\n          socket.off('call_accepted', handleCallAccepted);",
        content
    )
    
    # Also for user_offline, etc in HomeScreen
    content = re.sub(
        r"socket\.off\('user_offline'\);[\s\S]*?socket\.off\('availability_changed'\);",
        r"socket.off('user_offline', handleUserOffline);\n          socket.off('user_online', handleUserOnline);\n          socket.off('availability_changed', handleAvailabilityChanged);\n          socket.off('cancel_incoming_call', handleCancelIncoming);",
        content
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file(r'd:\App6\hima-meet-frontend\src\modules\home\screens\HomeScreen.tsx')
fix_file(r'd:\App6\hima-meet-frontend\src\modules\friends\screens\FriendsScreen.tsx')
