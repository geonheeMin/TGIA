import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Image
} from "react-native";
import useStore from "../../../store";
import member from "../../assets/dummy/member.json";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type chat = {
  sender_id: number;
  message: string;
  previousSender: number | null;
};

function ChatBubble(chat: chat) {
  const { session } = useStore();
  const sender = chat.sender_id;
  const my_id = session.member_id;
  const previous = chat.previousSender;
  useEffect(() => {
    console.log(chat);
  }, []);
  if (my_id === sender) {
    return (
      <View style={styles.myBubbleBox}>
        <Text style={{ color: "white" }}>{chat.message}</Text>
      </View>
    );
  } else {
    if (previous !== sender) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            marginTop: 10
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Image
              source={{ uri: sender?.profile_img }}
              style={{
                marginLeft: 10,
                width: 30,
                height: 30,
                borderWidth: 0.1,
                borderRadius: 30
              }}
            />
          </View>
          <View>
            <Text
              style={{
                alignSelf: "flex-start",
                marginLeft: 7,
                marginBottom: 5
              }}
            >
              {sender.username}
            </Text>
            <View style={styles.otherBubbleBoxStart}>
              <Text>{chat.message}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.otherBubbleBox}>
          <Text>{chat.message}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  myBubbleBox: {
    backgroundColor: "#0b60fe",
    borderRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: vw / 1.75,
    minHeight: vh / 22,
    marginRight: 10,
    marginBottom: 5
  },
  otherBubbleBoxStart: {
    backgroundColor: "#e3e3e3",
    borderRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: vw / 1.75,
    minHeight: vh / 22,
    marginLeft: 5,
    marginBottom: 5
  },
  otherBubbleBox: {
    backgroundColor: "#e3e3e3",
    borderRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: vw / 1.75,
    minHeight: vh / 22,
    marginLeft: 45,
    marginBottom: 5
  }
});

export default ChatBubble;
