import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useState, useCallback, useEffect} from 'react';
import Axios from 'axios';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type RootStackParamList = {
  ChatDetail: undefined;
};
type ChatDetailProps = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

function ChatDetail({route, navigation}: ChatDetailProps) {
  const [chats, setChats] = useState([]);
  const params = route.params;
  const chat_id = params.chat_id;
  const user = params.id;
  const other = params.other;
  const [posi, setPosi] = useState({});
  const [msg, setMsg] = useState('');
  const [time, setTime] = useState('');

  var date = new Date();
  var sendingTime = new Intl.DateTimeFormat('locale', {
    dateStyle: 'long',
    timeStyle: 'medium',
  }).format(date);

  const renderItem = ({item}) => {
    console.log(user === item.sender);
    return (
      <View style={user === item.sender ? style.Mine : style.Others}>
        <Text>{item.message}</Text>
      </View>
    );
  };

  const rendering = () => {
    Axios.get('http://localhost:8080/api/chat', {
      params: {chat_id: chat_id.toString()},
    }).then(res => {
      setChats(res.data);
    });
  };

  const sendMessage = () => {
    setTime(sendingTime);
    Axios.post(
      'http://localhost:8080/api/chatsend',
      {},
      {
        params: {
          chat_id: chat_id.toString(),
          sender: user,
          receiver: other,
          date: sendingTime,
          message: msg,
        },
      },
    ).then(res => {
      rendering();
      setMsg('');
    });
  };

  useEffect(() => {
    rendering();
  }, [chats]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>{user} 와 {other} 의 채팅</Text>
        </View>
      </ScrollView>
      <FlatList
        style={{height: vh / 2, width: vw, marginVertical: vh / 25}}
        renderItem={renderItem}
        data={chats}
      />
      <View style={{flex: 2, flexDirection: 'column'}}>
        <TextInput
          onChange={e => setMsg(e.nativeEvent.text)}
          value={msg}
          style={{
            borderWidth: 1,
            marginLeft: vw / 20,
            height: vh / 20,
            marginRight: vw / 5,
            width: vw - (vw / 20 + vw / 5),
          }}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{borderWidth: 1, height: vh / 20, width: vw / 7.5}}>
          <Text>전송</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  Others: {
    alignItems: 'flex-start',
    marginLeft: vw / 10,
  },
  Mine: {
    alignItems: 'flex-end',
    marginRight: vw / 10,
  },
});

export default ChatDetail;