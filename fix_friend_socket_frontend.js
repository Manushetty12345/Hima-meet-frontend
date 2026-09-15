const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/friends/screens/FriendsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let res;
        let type: 'friend' | 'favourite' | 'received' | 'sent' = 'friend';
        switch (activeTab) {
          case 'friends':
            res = await getFriends();
            type = 'friend';
            break;
          case 'favourite':
            res = await getFavourites();
            type = 'favourite';
            break;
          case 'requests':
            res = await getRequestsReceived();
            type = 'received';
            break;
          case 'sent':
            res = await getRequestsSent();
            type = 'sent';
            break;
        }

        if (res.data?.status === 'success') {
          setData(prev => ({
            ...prev,
            [activeTab]: res.data.data.map((item: any) => ({
              ...item,
              type,
            })),
          }));
        }
      } catch (err) {
        console.error('Failed to fetch data for tab:', activeTab, err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);`;

const newStr = `  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let res;
        let type: 'friend' | 'favourite' | 'received' | 'sent' = 'friend';
        switch (activeTab) {
          case 'friends':
            res = await getFriends();
            type = 'friend';
            break;
          case 'favourite':
            res = await getFavourites();
            type = 'favourite';
            break;
          case 'requests':
            res = await getRequestsReceived();
            type = 'received';
            break;
          case 'sent':
            res = await getRequestsSent();
            type = 'sent';
            break;
        }

        if (res.data?.status === 'success') {
          setData(prev => ({
            ...prev,
            [activeTab]: res.data.data.map((item: any) => ({
              ...item,
              type,
            })),
          }));
        }
      } catch (err) {
        console.error('Failed to fetch data for tab:', activeTab, err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();

    // WebSocket auto-refresh
    const socket = getSocket();
    if (socket) {
      socket.off('friend_update').on('friend_update', fetchData);
    }

    return () => {
      if (socket) {
        socket.off('friend_update', fetchData);
      }
    };
  }, [activeTab]);`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync(file, content);
  console.log("SUCCESS");
} else {
  // Try CRLF
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget = targetStr.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedTarget)) {
    content = normalizedContent.replace(normalizedTarget, newStr.replace(/\r\n/g, '\n'));
    fs.writeFileSync(file, content);
    console.log("SUCCESS via CRLF");
  } else {
    console.log("FAILED to find fetchData useEffect block");
  }
}
