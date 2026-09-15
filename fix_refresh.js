const fs = require('fs');
const file = 'D:/App6/hima-meet-frontend/src/modules/support/screens/MyTicketsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetImports = `import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, FlatList, ActivityIndicator, Alert } from 'react-native';`;
const replaceImports = `import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';`;

const targetState = `  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'RESOLVED'>('ACTIVE');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);`;
const replaceState = `  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'RESOLVED'>('ACTIVE');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);`;

const targetFetch = `  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load your tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };`;
const replaceFetch = `  const fetchTickets = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load your tickets. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    fetchTickets(true);
  }, []);`;

const targetFlatList = `          <FlatList
            data={filteredTickets}
            keyExtractor={item => item.id}
            renderItem={renderTicketItem}
            contentContainerStyle={styles.listContent}
          />`;
const replaceFlatList = `          <FlatList
            data={filteredTickets}
            keyExtractor={item => item.id}
            renderItem={renderTicketItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#D4AF37']}
                tintColor="#D4AF37"
              />
            }
          />`;

content = content.replace(targetImports, replaceImports);
content = content.replace(targetState, replaceState);
content = content.replace(targetFetch, replaceFetch);
content = content.replace(targetFlatList, replaceFlatList);

fs.writeFileSync(file, content);
console.log("MyTicketsScreen updated with RefreshControl");
