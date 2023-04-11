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
  ChatList: undefined;
};
type ChatListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ChatList"
>;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ChatListScreen({ route, navigation }: ChatListScreenProps) {
  const post = route.params?.post_id;
  const [chats, setChats] = useState([]);
  const { session, url } = useStore();
  const renderItem = ({ item }) => {
    return <ChatTitle chat={item} navigation={navigation} />;
  };

  const getMyChats = () => {
    Axios.get(
      `${url}/chat/get_chatroom_member_id?member_id=${session.member_id}`
    ).then((res) => {
      setChats(res.data);
      console.log(res.data);
    });
  };

  useEffect(() => {
    // const refreshMyChats = setInterval(() => {
    //   getMyChats();
    // }, 500);

    // return () => clearInterval(refreshMyChats);
    getMyChats();
  }, []);

  return (
    <SafeAreaView style={{ height: vh, backgroundColor: "white" }}>
      <View>
        <Text>채팅 리스트</Text>
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

export default ChatListScreen;
