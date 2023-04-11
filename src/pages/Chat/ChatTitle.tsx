import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  Dimensions,
  PixelRatio,
  Image
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState, useEffect } from "react";
import Axios from "axios";
import chatlist from "../../assets/dummy/chatlist.json";
import chatmessage from "../../assets/dummy/chat.json";
import memberlist from "../../assets/dummy/member.json";
import useStore from "../../../store";
type RootStackParamList = {
  ChatTitle: undefined;
};
type ChatTitleProps = NativeStackScreenProps<RootStackParamList, "ChatTitle">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ChatTitle({ chat, navigation }: ChatTitleProps) {
  const { session, url } = useStore();
  const [otherId, setOtherId] = useState(
    session.member_id === chat.member_a ? chat.member_b : chat.member_a
  );
  const [otherName, setOtherName] = useState("");
  const [latestMsg, setLatestMsg] = useState("");
  const [post, setPost] = useState();
  const count = chat.count;

  const toChatDetail = () => {
    navigation.navigate("ChatDetail", {
      chatroom: chat,
      post: post
    });
  };

  useEffect(() => {
    Axios.get(`${url}/chat/get_username?id=${otherId}`)
      .then((res) => {
        setOtherName(res.data);
      })
      .catch((error) => console.log(error));
    Axios.get(`${url}/chat/get_last_message?id=${chat.last_chatMessage}`)
      .then((res) => setLatestMsg(res.data))
      .catch((error) => console.log(error));
    Axios.get(`${url}/post/get_info?post_id=${chat.post_id}`)
      .then((res) => setPost(res.data))
      .catch((error) => console.log(error));
    console.log(chat.count);
  }, []);

  useEffect(() => {
    console.log(chat.memberA);
  });

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: vw / 33,
        height: vh / 10,
        borderBottomWidth: 0.34,
        borderColor: "#bcbcbc"
      }}
      onPress={toChatDetail}
    >
      {/* <Image
        source={{ uri: other.profile_img }}
        style={{ borderRadius: 45, width: 45, height: 45, borderWidth: 0.1 }}
      /> */}
      <View
        style={{
          marginLeft: 10,
          flexDirection: "column",
          alignItems: "flex-start",
          height: vh / 10,
          paddingTop: 10,
          borderWidth: 1,
          width: vw - (2 * vw) / 33 - 55
        }}
      >
        <Text
          style={{
            paddingTop: 10,
            fontSize: 17,
            fontWeight: "bold",
            color: "black",
            alignSelf: "flex-start"
          }}
        >
          {otherName}
        </Text>
        <Text numberOfLines={1} style={{ marginTop: 5 }}>
          {latestMsg}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#134dfe",
          width: vw / 9.5,
          height: vw / 9.5,
          borderRadius: vw / 9.5,
          justifyContent: "center",
          alignItems: "center",
          opacity: count > 0 ? 1 : 0
        }}
      >
        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
          {count < 99 ? count : "99+"}
        </Text>
      </View>
    </Pressable>
  );
}

export default ChatTitle;
