import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState, useEffect, useRef } from "react";
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
  RefreshControl
} from "react-native";
import ChatTitle from "./ChatTitle";
import Axios from "axios";
import {useNavigationState} from "@react-navigation/native";
import useStore from "../../../store";
import BottomTabs from "../../components/BottomTabs";
import chatlist from "../../assets/dummy/chatlist.json";
import chats from "../../assets/dummy/chat.json";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const post = route.params?.post_id;
  const [chats, setChats] = useState([]);
  const { session, url } = useStore();
  const isFocused = useIsFocused();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigationState = useNavigationState((state) => state);
  const renderItem = ({ item }) => {
    return <ChatTitle chat={item} navigation={navigation} />;
  };

  const getMyChats = () => {
    Axios.get(
      `${url}/chat/get_chatroom_member_id?member_id=${session?.member_id}`
    ).then((res) => {
      console.log(res.data);
      setChats(res.data);
    }).catch(err => console.log(err));
  };

  const refreshChats = () => {
    setIsRefreshing(true);
    getMyChats();
    setIsRefreshing(false);
  };

  useEffect(() => {
    console.log(navigationState.routes);
    if (isFocused) {
      refreshChats();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={{ height: vh, backgroundColor: "white" }}>
      <View
        style={{
          height: vh / 15,
          borderBottomWidth: 1.25,
          borderColor: "#b6bcd3",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>채팅</Text>
      </View>
      {chats.length === 0 ? (
        <View style={{
          width: vw, 
          height : vh - insets.top - vh / 15 - vh / 11,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text
            style={{
              color: "lightgrey",
              fontSize: 25,
              fontWeight: "bold"
            }}
          >
            아직 채팅을 하지 않았습니다
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              onRefresh={refreshChats}
              refreshing={isRefreshing}
            />
          }
        />
      )}
      <BottomTabs navigation={navigation} screen="ChatList" />
    </SafeAreaView>
  );
}

export default ChatListScreen;
