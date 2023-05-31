import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Platform,
  Image
} from "react-native";
import { ChatApis } from "./ChatApis";
import useStore from "../../../store";
import Axios from "axios";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type chat = {
  sender_id: number;
  message: string;
  previousSender: number | null;
  time: string;
};

function ChatBubble(chat: chat) {
  const { session, url } = useStore();
  const sender = chat.sender_id;
  const my_id = session?.member_id;
  const previous = chat.previousSender;
  const [senderImage, setSenderImage] = useState("");

  useEffect(() => {
    if (my_id !== sender) {
      Axios.get(`${url}/member/get_image?member_id=${sender}`)
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
        <View style={styles.myBubbleArea}>
          <View style={styles.myBubbleTimeArea}>
            <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
          </View>
          <View style={styles.myApiBox}>
          <Image source={ChatApis[0].img} style={styles.myApiImage}/>
          </View>
        </View>
      );
    }
    if (chat.message === ChatApis[1].api) {
      return (
        <View style={styles.myBubbleArea}>
          <View style={styles.myBubbleTimeArea}>
            <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
          </View>
          <View style={styles.myApiBox}>
            <Image source={ChatApis[1].img} style={styles.myApiImage}/>
          </View>
        </View>
      );
    }
    if (chat.message === ChatApis[2].api) {
      return (
        <View style={styles.myBubbleArea}>
          <View style={styles.myBubbleTimeArea}>
            <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
          </View>
          <View style={styles.myApiBox}>
           <Image source={ChatApis[2].img} style={styles.myApiImage}/>
          </View>
        </View>
      );
    }
    if (chat.message === ChatApis[3].api) {
      return (
        <View style={styles.myBubbleArea}>
          <View style={styles.myBubbleTimeArea}>
            <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
          </View>
          <View style={styles.myApiBox}>
          <Image source={ChatApis[3].img} style={styles.myApiImage}/>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.myBubbleArea}>
        <View style={styles.myBubbleTimeArea}>
          <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
        </View>
        <View style={styles.myBubbleBox}>
          <Text style={{ color: "white" }}>{chat.message}</Text>
        </View>
      </View>
    );
  } else {
    if (chat.message === ChatApis[0].api) {
      return (
        <View style={styles.otherApiBox}>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Image
              source={{ uri: `${url}/images/${senderImage}` }}
              style={styles.otherImage}
            />
            <View style={styles.otherBubbleStartArea}>
            <Image
              source={ChatApis[0].img}
              style={styles.otherApiImage} />
            </View>
            <View style={styles.otherBubbleTimeArea}>
              <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
            </View>
          </View>
        </View>
      );
    }
    if (chat.message === ChatApis[1].api) {
      return (
        <View style={styles.otherApiBox}>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Image
              source={{ uri: `${url}/images/${senderImage}` }}
              style={styles.otherImage}
            />
            <View style={styles.otherBubbleStartArea}>
              <Image
                source={ChatApis[1].img}
                style={styles.otherApiImage} />
            </View>
            <View style={styles.otherBubbleTimeArea}>
              <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
            </View>
          </View>
        </View>
      );
    }
    if (chat.message === ChatApis[2].api) {
      return (
        <View style={styles.otherApiBox}>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Image
              source={{ uri: `${url}/images/${senderImage}` }}
              style={styles.otherImage}
            />
            <View style={styles.otherBubbleStartArea}>
              <Image
                source={ChatApis[2].img}
                style={styles.otherApiImage} />
            </View>
            <View style={styles.otherBubbleTimeArea}>
              <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
            </View>
          </View>
        </View>
      );
    }
    if (chat.message === ChatApis[3].api) {
      return (
        <View style={styles.otherApiBox}>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Image
              source={{ uri: `${url}/images/${senderImage}` }}
              style={styles.otherImage}
            />
            <View style={styles.otherBubbleStartArea}>
              <Image
                source={ChatApis[3].img}
                style={styles.otherApiImage} />
            </View>
            <View style={styles.otherBubbleTimeArea}>
              <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
            </View>
          </View>
        </View>
      );
    }
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
              style={styles.otherImage}
            />
          </View>
          <View style={styles.otherBubbleStartArea}>
            <View style={styles.otherBubbleBoxStart}>
              <Text>{chat.message}</Text>
            </View>
            <View style={styles.otherBubbleTimeArea}>
              <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.otherBubbleArea}>
          <View style={styles.otherBubbleBox}>
            <Text>{chat.message}</Text>
          </View>
          <View style={styles.otherBubbleTimeArea}>
            <Text style={{ fontSize: 10, color: "grey" }}>{chat.time}</Text>
          </View>
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
    marginBottom: 5
  },
  otherBubbleBoxStart: {
    backgroundColor: "#e3e3e3",
    borderRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: vw / 1.75,
    minHeight: vh / 22
  },
  otherBubbleBox: {
    backgroundColor: "#e3e3e3",
    borderRadius: 30 / PixelRatio.get(),
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: vw / 1.75,
    minHeight: vh / 22
  },
  otherImage: {
    marginLeft: 10,
    width: 30,
    height: 30,
    borderWidth: 0.1,
    borderRadius: 30
  },
  myApiBox: {
    alignSelf: "flex-end",
    borderWidth: 1
  },
  myApiImage: {
    alignSelf: "flex-end",
    width: 450 / 2.5,
    height: 463 / 2.5,
  },
  otherApiBox: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 5
  },
  otherApiImage: {
    alignSelf: "flex-start",
    width: 450 / 2.5,
    height: 463 / 2.5
  },
  myBubbleArea: {
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    minHeight: vh / 22,
    marginRight: 10,
    paddingBottom: 5
  },
  otherBubbleStartArea: {
    flexDirection: "row",
    justifyContent: "flex-start",
    maxWidth: vw / 1.75 + 60,
    minHeight: vh / 22,
    marginLeft: 5,
    paddingBottom: 5
  },
  otherBubbleArea: {
    flexDirection: "row",
    justifyContent: "flex-start",
    maxWidth: vw / 1.75 + 60,
    minHeight: vh / 22,
    marginLeft: 45,
    paddingBottom: 5
  },
  myBubbleTimeArea: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    width: 50,
    height: 15,
    marginRight: 3
  },
  otherBubbleTimeArea: {
    alignSelf: "flex-end",
    width: 50,
    height: 15,
    marginLeft: 3
  }
});

export default ChatBubble;
