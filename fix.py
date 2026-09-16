import sys

filename = r'd:\App6\hima-meet-frontend\src\modules\home\components\CreatorProfileModal.tsx'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "  // Handle Socket\n  useEffect(() => {\n    let active = true;\n    let localSocket: any = null;\n\n    const setupChat = async () => {\n      if (friendStatus === 'friends' && creator) {"
end_marker = "    return () => {\n      active = false;\n      if (localSocket) {\n        if (conversationId) localSocket.emit('leave_chat', { conversationId });\n        localSocket.off('receive_message');\n        localSocket.off('message_status_update');\n        localSocket.off('user_online');\n        localSocket.off('user_offline');\n      }\n      disconnectSocket();\n    };\n  }, [friendStatus, creator]);"

# Normalize line endings to avoid issues
content = content.replace('\r\n', '\n')

new_block = """  // Handle Socket
  useEffect(() => {
    let active = true;
    let localSocket: any = null;

    const setupListeners = async () => {
      if (!creator) return;
      try {
        localSocket = await initSocket();
        if (!localSocket || !active) return;

        localSocket.on('user_online', (data: any) => {
          if (data.userId?.toString() === creator.id?.toString()) setIsOnline(true);
        });
        
        localSocket.on('availability_changed', (data: any) => {
          if (data.userId?.toString() === creator.id?.toString()) {
            if (data.call_type === 'voice') setCallAvailable(data.is_online);
            if (data.call_type === 'video') setVideoAvailable(data.is_online);
          }
        });
        
        localSocket.on('user_offline', (data: any) => {
          if (data.userId?.toString() === creator.id?.toString()) {
            setIsOnline(false);
            setLastSeen(new Date().toISOString());
          }
        });

        if (friendStatus === 'friends') {
          const convRes = await apiClient.get(`/api/chat/conversation/${creator.id}`);
          const convId = convRes.data?.data?.conversation_id;
          
          if (convRes.data?.data?.targetUserStatus) {
            setIsOnline(convRes.data.data.targetUserStatus.isOnline);
            setLastSeen(convRes.data.data.targetUserStatus.lastSeen);
          }

          if (!active || !convId) return;
          setConversationId(convId);

          const msgRes = await apiClient.get(`/api/chat/${convId}/messages`);
          if (msgRes.data?.data) {
            setMessagesList(msgRes.data.data.reverse());
          }

          localSocket.emit('join_chat', { conversationId: convId });

          localSocket.on('receive_message', (data: any) => {
            setMessagesList(prev => {
              if (prev.find(m => m.message_id === data.message_id)) return prev;
              return [...prev, data];
            });
            
            if (data.sender_id === creator.id) {
              localSocket.emit('message_delivered', { conversationId: convId, messageId: data.message_id });
              localSocket.emit('message_read', { conversationId: convId, messageId: data.message_id });
            }
          });

          localSocket.on('message_status_update', (data: any) => {
            setMessagesList(prev => prev.map(msg => 
              msg.message_id === data.message_id ? { ...msg, status: data.status } : msg
            ));
          });
        }
      } catch (e: any) {
        const errMsg = e.response?.data?.message || e.message;
        console.error('Error setting up socket', errMsg);
      }
    };

    setupListeners();

    return () => {
      active = false;
      if (localSocket) {
        if (conversationId) localSocket.emit('leave_chat', { conversationId });
        localSocket.off('receive_message');
        localSocket.off('message_status_update');
        localSocket.off('user_online');
        localSocket.off('availability_changed');
        localSocket.off('user_offline');
      }
    };
  }, [friendStatus, creator, conversationId]);"""

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker) + len(end_marker)
    new_content = content[:start_idx] + new_block + content[end_idx:]
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("Markers not found!")
    if start_marker not in content:
        print("Start marker missing")
    if end_marker not in content:
        print("End marker missing")
