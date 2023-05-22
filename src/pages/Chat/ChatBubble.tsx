import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Image
} from "react-native";
import { ChatApis } from "./ChatApis";
import useStore from "../../../store";
import Axios from "axios";
import requestPayment from "../../assets/design/api/requestPay.png";
import reservation from "../../assets/design/api/reservation.png";
import sendLocation from "../../assets/design/api/myLocation.png";
const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type chat = {
  sender_id: number;
  message: string;
  previousSender: number | null;
};

function ChatBubble(chat: chat) {
  const { session, url } = useStore();
  const sender = chat.sender_id;
  const my_id = session?.member_id;
  const previous = chat.previousSender;
  const [senderImage, setSenderImage] = useState("");

  useEffect(() => {
    if (my_id !== sender) {
      Axios.get(`${url}/member/get_image?member_id=${sender.member_id}`)
        .then((res) => {
          setSenderImage(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  if (my_id === sender) {
    if (chat.message === ChatApis[0].api) {
      return (
        <View style={styles.myApiBoxTop}>
          <View style={styles.myApiBoxBottom} />
          <Image source={ChatApis[0].img} />
        </View>
      );
    }
    if (chat.message === ChatApis[1].api) {
      return (
        <View style={styles.myApiBoxTop}>
          <View style={styles.myApiBoxBottom} />
          <Image source={ChatApis[0].img} />
        </View>
      );
    }
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
              source={{ uri: `${url}/images/${senderImage}` }}
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
  },
  myApiBoxTop: {
    backgroundColor: "#0b60fe",
    borderRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-end",
    Width: vw / 1.75,
    height: vh / 5
  },
  myApiBoxBottom: {
    backgroundColor: "white",
    borderBottomRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-start",
    position: "absolute",
    width: vw / 1.75,
    height: vh / 7,
    bottom: 0
  },
  otherApiBoxTop: {
    backgroundColor: "#0b60fe",
    borderRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-start",
    width: vw / 1.75,
    height: vh / 5
  },
  otherApiBoxBottom: {
    backgroundColor: "white",
    borderBottomRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-start",
    position: "absolute",
    width: vw / 1.75,
    height: vh / 7,
    bottom: 0
  }
});

export default ChatBubble;
