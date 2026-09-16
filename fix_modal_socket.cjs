const fs = require('fs');
const file = 'd:/App6/hima-meet-frontend/src/modules/home/components/CreatorProfileModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const setupChat = async \(\) => \{[\s\S]*?if \(friendStatus === 'friends'\) \{\n\s*setupChat\(\);\n\s*\} else \{\n\s*disconnectSocket\(\);\n\s*\}/;

const replacement = `const setupListeners = async () => {
        if (!creator) return;
        
        try {
          localSocket = await initSocket();
          if (!localSocket || !active) return;

          // Always listen to status updates regardless of friendship
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

          // Only setup chat if friends
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

      setupListeners();`;

content = content.replace(regex, replacement);

// Remove the `disconnectSocket()` in cleanup if it's there
content = content.replace(
  /localSocket\.off\('user_offline'\);\n\s*\}\n\s*disconnectSocket\(\);\n\s*\};\n\s*\}, \[friendStatus, creator\]\);/,
  `localSocket.off('user_offline');\n        localSocket.off('availability_changed');\n        }\n        // We don't disconnect the global socket here because HomeScreen needs it\n      };\n    }, [friendStatus, creator]);`
);


fs.writeFileSync(file, content);
console.log("SUCCESS");
