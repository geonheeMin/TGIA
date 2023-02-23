import * as React from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState, useEffect} from 'react';
import Axios from 'axios';

type RootStackParamList = {
  ChatTitle: undefined;
};
type ChatTitleProps = NativeStackScreenProps<RootStackParamList, 'ChatTitle'>;

function ChatTitle({id, chat, navigation}: ChatTitleProps) {
  const [other, setOther] = useState(
    id === chat.member_A ? chat.member_B : chat.member_A,
  );
  const toChatDetail = useCallback(() => {
    navigation.navigate('ChatDetail', {
      id: id,
      chat_id: chat.chat_id,
      other: other,
    });
  }, [id, chat, other, navigation]);

  return (
    <TouchableOpacity style={{flex: 2, flexDirection: 'column'}} onPress={toChatDetail}>
      <Text style={{fontSize: 30, color: 'black'}}>{other}</Text>
    </TouchableOpacity>
  );
}

export default ChatTitle;