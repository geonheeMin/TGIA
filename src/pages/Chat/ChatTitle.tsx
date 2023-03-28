import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  Dimensions,
  Image
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState, useEffect } from "react";
import Axios from "axios";
import chatlist from "../../assets/dummy/chatlist.json";
import chatmessage from "../../assets/dummy/chat.json";
import memberlist from "../../assets/dummy/member.json";
type RootStackParamList = {
  ChatTitle: undefined;
};
type ChatTitleProps = NativeStackScreenProps<RootStackParamList, "ChatTitle">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ChatTitle({ id, chat, navigation }: ChatTitleProps) {
  const [otherId, setOtherId] = useState(
    id === chat.memberA ? chat.memberB : chat.memberA
  );
  const other = memberlist.memberlist.filter(
    (item) => item.user_id === otherId
  )[0];
  const latestMsg = chatmessage.chat.filter(
    (item) => item.chat_id === chat.latest_msg
  )[0];
  const toChatDetail = useCallback(() => {
    navigation.navigate("ChatDetail", {
      id: id,
      chat_id: chat.chat_id,
      other: other
    });
  }, [id, chat, other, navigation]);

  useEffect(() => {
    console.log(chat.memberA);
  });

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: vw / 33,
        height: vh / 10,
        borderBottomWidth: 0.34,
        borderColor: "#bcbcbc"
      }}
    >
      <Image
        source={{ uri: other.profile_img }}
        style={{ borderRadius: 45, width: 45, height: 45, borderWidth: 0.1 }}
      />
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
          {other?.username}
        </Text>
        <Text numberOfLines={1} style={{ marginTop: 5 }}>
          {latestMsg.message}
        </Text>
      </View>
    </View>
  );
}

export default ChatTitle;
