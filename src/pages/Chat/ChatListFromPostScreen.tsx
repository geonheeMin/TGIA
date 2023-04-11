import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState, useEffect } from "react";
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
  FlatList
} from "react-native";
import ChatTitle from "./ChatTitle";
import Axios from "axios";
import useStore from "../../../store";
import BottomTabs from "../../components/BottomTabs";
import chatlist from "../../assets/dummy/chatlist.json";
import chats from "../../assets/dummy/chat.json";

type RootStackParamList = {
  ChatListFromPost: undefined;
};
type ChatListFromPostScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ChatListFromPost"
>;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ChatListFromPostScreen({
  route,
  navigation
}: ChatListFromPostScreenProps) {
  const post = route.params?.post_id;
  const [chats, setChats] = useState([]);
  const { session, url } = useStore();
  const renderItem = ({ item }) => {
    return <ChatTitle chat={item} navigation={navigation} />;
  };

  useEffect(() => {
    if (post !== undefined) {
      Axios.get(`${url}/chat/get_chat_room_list?id=${post}`)
        .then((res) => {
          setChats(res.data);
        })
        .catch((error) => console.log(error));
    }
    // setChats(
    //   chatlist.chatlist.filter(
    //     (item) => item.memberA === 1 || item.memberB === 1
    //   )
    // );
  }, []);

  return (
    <SafeAreaView style={{ height: vh, backgroundColor: "white" }}>
      <View>
        <Text>채팅 리스트2</Text>
      </View>
      <FlatList
        style={{ height: vh / 1.5 }}
        data={chats.sort((a, b) => b.last_chatMessage - a.last_chatMessage)}
        renderItem={renderItem}
      />
      <BottomTabs navigation={navigation} screen="ChatList" />
    </SafeAreaView>
  );
}

export default ChatListFromPostScreen;
