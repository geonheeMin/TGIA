import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  FlatListProps,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Pressable,
  StyleSheet,
  Image
} from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import Axios from "axios";
import useStore from "../../../store";
import myBubble from "../../assets/design/myBubble.png";
import otherBubble from "../../assets/design/otherBubble.png";
import sendIcon from "../../assets/design/sendIcon2.png";
import chatPlus from "../../assets/design/chatPlus.png";
import backArrow from "../../assets/design/backIcon.png";
import ChatBubble from "./ChatBubble";
import test from "../../assets/dummy/chat.json";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  ChatDetail: undefined;
};
type ChatDetailProps = NativeStackScreenProps<RootStackParamList, "ChatDetail">;
type bubbleProps = {
  sender: string;
  message: string;
};
type MyFLatListProps<T> = FlatListProps<T>;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ChatDetail({ route, navigation }: ChatDetailProps) {
  const [msgRef, setMsgRef] = useState(null);
  const { session, url } = useStore();
  const params = route.params;
  const chatroom = params.chatroom;
  const post = params.post;
  const other = post.writer;
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("hi");
  const [time, setTime] = useState("");

  var date = new Date();
  var sendingTime = new Intl.DateTimeFormat("locale", {
    dateStyle: "long",
    timeStyle: "medium"
  }).format(date);

  // const renderItem = ({ item }) => {
  //   console.log(user === item.sender);
  //   return (
  //     <View style={user === item.sender ? style.Mine : style.Others}>
  //       <Text>{item.message}</Text>
  //     </View>
  //   );
  // };

  // function otherBubbles(sender: string, message: string) {
  //   return (
  //     <View style={styles.otherBubbleBox}>
  //       <Text>{message}</Text>
  //     </View>
  //   );
  // }

  const backward = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderChat = ({ item }) => {
    const previousList = chats.filter(
      (msg) =>
        msg.chat_id < item.chat_id && msg.chatroom_id === item.chatroom_id
    );
    const previous =
      previousList.length > 1
        ? previousList[previousList.length - 1].sender_id
        : null;
    return (
      <ChatBubble
        previousSender={previous}
        sender_id={item.sender}
        message={item.message}
      ></ChatBubble>
    );
  };

  const rendering = () => {
    // Axios.get("http://localhost:8080/api/chat", {
    //   params: { chat_id: chat_id.toString() }
    // }).then((res) => {
    //   setChats(res.data);
    // });
  };

  const sendMessage = () => {
    const SendMessageRequestDTO = {
      chatroom_id: chatroom,
      sender_id: session.member_id,
      message: msg
    };
    Axios.post(`${url}/chat/send_V2`, SendMessageRequestDTO, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        setChats(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setMsg("");
  };

  useEffect(() => {
    Axios.get(`${url}/chat/get_chat_message_list?id=${chatroom}`)
      .then((res) => {
        console.log(res.data);
        console.log(session.member_id);
        setChats(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          borderBottomWidth: 0.34,
          borderBottomColor: "#d7d7d7",
          height: vh / 20,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Pressable onPress={backward} style={{ marginLeft: 10 }}>
          <Image
            source={backArrow}
            style={{ width: vw / 15, height: vw / 15 }}
          />
        </Pressable>
        <Text style={{ marginLeft: 10 }}>{other}</Text>
      </View>
      <View style={{ paddingTop: 5, height: vh - vh / 3.9 }}>
        <FlatList
          data={chats}
          renderItem={renderChat}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: vh / 10.5,
          flexDirection: "row",
          width: vw,
          height: vh / 17.5,
          justifyContent: "space-between",
          borderTopWidth: 0.34,
          borderTopColor: "#eaeaea",
          zIndex: 10,
          backgroundColor: "white"
        }}
      >
        <Pressable
          style={{
            marginLeft: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            source={chatPlus}
            style={{ width: vh / 25, height: vh / 25 }}
          />
        </Pressable>
        <TextInput
          style={{
            marginLeft: -5,
            alignSelf: "center",
            width: vh / 3.05,
            height: vh / 25,
            borderRadius: 15,
            paddingLeft: 15,
            backgroundColor: "#eee"
          }}
          value={msg}
          onChangeText={setMsg}
        />
        <Pressable
          style={{
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            marginRight: vw / 22.5
          }}
          onPress={sendMessage}
        >
          <Image
            source={sendIcon}
            style={{ width: vw / 15, height: vh / 30, overflow: "visible" }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: vw,
    height: vh
  },
  Others: {
    alignItems: "flex-start",
    marginLeft: vw / 10
  },
  Mine: {
    alignItems: "flex-end",
    marginRight: vw / 10
  },
  inputBar: {
    flexDirection: "row",
    marginLeft: vw / 20,
    height: vh / 20,
    marginRight: vw / 5,
    width: vw - vw / 10,
    top: vh - vh / 4
  },
  inputArea: {
    borderWidth: 1,
    height: vh / 20,
    width: vw - (vw / 20 + vw / 4.5)
  },
  myBubbleBox: {
    backgroundColor: "#0b60fe",
    borderRadius: 10,
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: vw / 1.75,
    minHeight: vh / 22
  },
  otherBubbleBox: {
    backgroundColor: "#e3e3e3",
    borderRadius: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: vw / 1.75,
    minHeight: vh / 22
  }
});

export default ChatDetail;
