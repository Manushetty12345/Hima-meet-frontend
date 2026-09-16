const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /useEffect\(\(\) => \{\n\s*let active = true;\n\s*let localSocket: any = null;\n\n\s*const setupChat = async \(\) => \{[\s\S]*?\}, \[friendStatus, creator\]\);/;

const replacement = `useEffect(() => {
    let active = true;
    let localSocket: any = null;

    const setupListeners = async () => {
      if (!creator) return;
      
      try {
        localSocket = await initSocket();
        if (!localSocket || !active) return;

        // 1. Setup global listeners for this modal, regardless of friend status
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

        // 2. Setup specific chat listeners if they are friends
        if (friendStatus === 'friends') {
          const convRes = await apiClient.get(\`/api/chat/conversation/\${creator.id}\`);
          const convId = convRes.data?.data?.conversation_id;
          
          if (convRes.data?.data?.targetUserStatus) {
            setIsOnline(convRes.data.data.targetUserStatus.isOnline);
            setLastSeen(convRes.data.data.targetUserStatus.lastSeen);
          }

          if (!active || !convId) return;
          setConversationId(convId);

          const msgRes = await apiClient.get(\`/api/chat/\${convId}/messages\`);
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
        console.error('Error setting up chat/listeners', errMsg);
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
      // DANGEROUS: Do NOT disconnect global socket here, because it kills the HomeScreen's connection!
      // disconnectSocket(); 
    };
  }, [friendStatus, creator, conversationId]);`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("SUCCESS");
