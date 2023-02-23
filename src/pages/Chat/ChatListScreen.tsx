import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import ChatTitle from './ChatTitle';
import Axios from 'axios';

type RootStackParamList = {
  ChatList: undefined;
};
type ChatListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ChatList'
>;

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

function ChatListScreen({route, navigation}: ChatListScreenProps) {
  const params = route.params;
  const id = params.id;
  const [chats, setChats] = useState([]);

  const renderItem = ({item}) => {
    return <ChatTitle id={id} chat={item} navigation={navigation} />;
  };

  useEffect(() => {
    Axios.get('http://localhost:8080/api/chatlist', {
      params: {member: id},
    }).then(res => {
      setChats(res.data);
    });
  }, [id]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>채팅 리스트</Text>
        </View>
      </ScrollView>
      <FlatList
        style={{height: vh / 1.5}}
        data={chats}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

export default ChatListScreen;