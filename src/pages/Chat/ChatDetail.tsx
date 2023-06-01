import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  Dimensions,
  Pressable,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  BackHandler,
  Alert
} from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import Axios from "axios";
import useStore from "../../../store";
import { useNavigationState } from "@react-navigation/native";
import sendIcon from "../../assets/design/sendIcon2.png";
import ChatBubble from "./ChatBubble";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import IonIcon from "react-native-vector-icons/Ionicons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { ChatApis } from "./ChatApis";

type RootStackParamList = {
  ChatDetail: undefined;
};
type ChatDetailProps = NativeStackScreenProps<RootStackParamList, "ChatDetail">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;
const sh = Dimensions.get("screen").height;

function ChatDetail({ route, navigation }: ChatDetailProps) {
  const navigationState = useNavigationState((state) => state);

  const chatRef = useRef(null);
  const { session, url } = useStore();
  const isFocused = useIsFocused();
  const params = route.params;
  const post = params?.post;
  const chatroom = params?.chatroom;
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");
  const [other, setOther] = useState();
  const [otherName, setOtherName] = useState("");
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [keyHeight, setKeyHeight] = useState(0);
  /** isChatLoaded: Axios 통신으로 받아온 데이터 처리 완료 여부, true면 Axios 함수 처리가 완전히 끝난 것으로 Axios 통신해도 되는 상태
   * false면 아직 Axios로 받아온 데이터를 처리하는 과정으로 Axios 통신하면 안된다는 것을 의미
   */
  const [isChatLoaded, setIsChatLoaded] = useState(true);
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [inHansung, setInHansung] = useState(false);

  const Hansung = { latitude: 37.582429, longitude: 127.010084 };

  const requestPayment = () => {
    sendApi(ChatApis[0].api);
  };

  const reservation = () => {
    const post_id = {
      post_id: post.post_id
    };
    Axios.post(`${url}/reservation_posts`, post_id).then((res) => {
      sendApi(ChatApis[2].api);
    });
  };

  const tryPayment = () => {
    stopChat();
    navigation.navigate("Payment", { post: post, chatroom: chatroom });
  };

  const startChat = () => {
    getChats();
    const newTimerId = setInterval(() => {
      getChats();
    }, 2000);
    setTimerId(newTimerId);
  };

  const stopChat = () => {
    timerId && clearInterval(timerId);
    setTimerId(null);
  };

  const locationCalc = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lat = parseInt(JSON.stringify(position.coords.latitude));
        const lon = parseInt(JSON.stringify(position.coords.longitude));
        setLatitude(lat);
        setLongitude(lon);

        distanceCalc(Hansung.latitude, Hansung.longitude, lat, lon);
      },
      (err) => {
        console.log(err.code, err.message);
      },
      Platform.OS === "android"
        ? {}
        : { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const distanceCalc = (
    HansungLat: number,
    HansungLon: number,
    lat: number,
    lon: number
  ) => {
    const radius = 6371;
    const toRadian = Math.PI / 180;
    const deltaLatitude = Math.abs(HansungLat - lat) * toRadian;
    const deltaLongitude = Math.abs(HansungLon - lon) * toRadian;
    const first =
      Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
      Math.cos(HansungLat * toRadian) *
        Math.cos(lat * toRadian) *
        Math.sin(deltaLongitude / 2) *
        Math.sin(deltaLongitude / 2);
    const second = 2 * Math.atan2(Math.sqrt(first), Math.sqrt(1 - first));

    const distance = radius * second;

    if (distance <= 150) {
      console.log(distance);
      setInHansung(true);
    } else setInHansung(false);
  };

  const checkCalc = () => {
    Alert.alert(
      "위치 전송",
      "현재 한성대학교 내에 있음을 상대방에게 알리겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel"
        },
        {
          text: "예",
          onPress: () => {
            locationCalc();
            setTimeout(() => {
              if (inHansung) {
                sendApi(ChatApis[3].api);
              } else {
                Alert.alert(
                  "위치 전송 실패",
                  "현재 위치가 한성대학교 내에 있지 않습니다",
                  [
                    {
                      text: "확인",
                      style: "cancel"
                    }
                  ]
                );
              }
            }, 1500);
          }
        }
      ]
    );
  };

  const backward = () => {
    stopChat();
    // navigation.goBack();
    if (
      navigationState.routes[navigationState.routes.length - 2].name ===
      "ChatList"
    ) {
      navigation.replace("ChatList");
    } else {
      navigation.goBack();
    }
  };

  const renderChat = ({ item }) => {
    const previousList = chats.filter(
      (msg) =>
        msg.message_id < item.message_id && msg.chatroom_id === item.chatroom_id
    );
    const previous =
      previousList.length > 0
        ? previousList[previousList.length - 1].sender
        : null;
    return (
      <ChatBubble
        previousSender={previous}
        sender_id={item.sender}
        message={item.message}
        time={item.time}
      ></ChatBubble>
    );
  };

  const handleScrollToEnd = () => {
    chatRef.current?.scrollToEnd({ animated: true });
  };

  const sendApi = (api: string) => {
    const SendMessageRequestDTO = {
      chatroom_id: chatroom.chatroom_id,
      sender_id: session?.member_id,
      message: api
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
    handleScrollToEnd();
    setMsg("");
  };

  const sendMessage = () => {
    const SendMessageRequestDTO = {
      chatroom_id: chatroom.chatroom_id,
      sender_id: session?.member_id,
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
    handleScrollToEnd();
    setMsg("");
  };

  const getChats = () => {
    if (isChatLoaded) {
      Axios.get(`${url}/chat/get_chat_message_list`, {
        params: { id: chatroom.chatroom_id, member_id: session?.member_id }
      })
        .then((res) => {
          console.log(res.data);
          setIsChatLoaded(false);
          setChats(res.data);
        })
        .then((res) => {
          setIsChatLoaded(true);
        })
        .catch((error) => console.log(error));
    }
  };

  const menuClosed = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: Platform.OS === "ios" ? keyHeight : vh / 66,
          flexDirection: "row",
          width: vw,
          height: Platform.OS === "ios" ? vh / 12 : vh / 15,
          justifyContent: "space-between",
          alignItems: "center",
          borderTopWidth: 0.34,
          borderTopColor: "#eaeaea",
          zIndex: 10,
          backgroundColor: "white"
        }}
      >
        <Pressable
          style={{
            marginLeft: Platform.OS === "ios" ? 10 : 15,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => setIsMenuOpened(!isMenuOpened)}
        >
          <FeatherIcon name="plus-square" size={vw / 12.5} />
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
    );
  };

  const menuOpened = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: vh / 50,
          flexDirection: "row",
          width: vw,
          height: vh / 7.5,
          alignItems: "center",
          justifyContent: "center",
          borderTopWidth: 0.34,
          borderTopColor: "#d3d3d3",
          zIndex: 10,
          backgroundColor: "white"
        }}
      >
        <Pressable
          style={{
            left: Platform.OS === "ios" ? 10 : 15,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute"
          }}
          onPress={() => {
            setIsMenuOpened(!isMenuOpened);
          }}
        >
          <FeatherIcon name="x-square" size={vw / 12.5} />
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginLeft: vw / 10,
            width: vw - (vw * 2) / 10,
            height: vh / 8.5
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-around",
              height: vh / 10,
              width: vw / 5
            }}
          >
            <Pressable
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: vw / 7,
                height: vw / 7,
                borderRadius: vw / 7,
                backgroundColor: "#fee10c"
              }}
              onPress={
                post.member_id === session?.member_id
                  ? () => requestPayment()
                  : tryPayment
              }
            >
              <FontAwesomeIcon name="won" color="#6b6b6b" size={25} />
            </Pressable>
            <Text style={{ fontWeight: "600", fontSize: 15 }}>
              {post.member_id === session?.member_id ? "송금요청" : "송금하기"}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-around",
              height: vh / 10,
              width: vw / 5
            }}
          >
            <Pressable
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: vw / 7,
                height: vw / 7,
                borderRadius: vw / 7,
                backgroundColor: "#3775ff"
              }}
              onPress={() => checkCalc()}
            >
              <EntypoIcon name="location" color="white" size={25} />
            </Pressable>
            <Text style={{ fontWeight: "600", fontSize: 15 }}>내 위치</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-around",
              height: vh / 10,
              width: vw / 5
            }}
          >
            <Pressable
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: vw / 7,
                height: vw / 7,
                borderRadius: vw / 7,
                backgroundColor: "#00bb40"
              }}
              onPress={reservation}
            >
              <FontAwesomeIcon
                name="calendar-check-o"
                color="white"
                size={25}
              />
            </Pressable>
            <Text style={{ fontWeight: "600", fontSize: 15 }}>거래 예약</Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (isFocused) {
      startChat();
    } else {
      stopChat();
    }
  }, [isFocused]);

  useEffect(() => {
    Axios.get(
      `${url}/chat/get_chat_members?chatroom_id=${chatroom.chatroom_id}`
    )
      .then((res) => {
        setOther(
          res.data.aid === session?.member_id ? res.data.bid : res.data.aid
        );
      })
      .catch((err) => console.log(err));
    const keyUpListener = Keyboard.addListener("keyboardWillShow", (event) => {
      setKeyHeight(event.endCoordinates.height);
    });
    const keyDownListener = Keyboard.addListener("keyboardWillHide", (e) =>
      setKeyHeight(0)
    );
    // const backListener = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   () => {
    //     stopChat();
    //     return false;
    //   }
    // );
    // return () => backListener.remove();
    navigation.addListener("beforeRemove", (e) => {
      stopChat();
    });
  }, []);

  useEffect(() => {
    console.log(other);
    Axios.get(`${url}/member/get_username?id=${other}`)
      .then((res) => {
        setOtherName(res.data);
      })
      .catch((err) => console.log(err));
  }, [other]);

  useEffect(() => {
    locationCalc();
  }, [latitude, longitude]);

  return Platform.OS === "android" ? (
    <KeyboardAvoidingView
      behavior={"height"}
      keyboardVerticalOffset={30}
      style={styles.container}
      removeClippedSubviews={false}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#d7d7d7",
          height: vh / 15,
          width: vw,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View
          style={{
            height: vh / 20,
            position: "absolute",
            left: 0,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Pressable onPress={() => backward()} style={{ marginLeft: 10 }}>
            <IonIcon name={"chevron-back-sharp"} size={25} />
          </Pressable>
          <Text style={{ marginLeft: vw / 40 }}>{otherName}</Text>
        </View>
        <View
          style={{
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Text style={{ fontSize: 20 }}>
            {post.title.length > 8
              ? post.title.slice(0, 8) + "..."
              : post.title}
          </Text>
        </View>
      </View>
      <View
        style={{
          paddingTop: 5,
          height: isMenuOpened ? vh - vh / 4.55 : vh - vh / 7.55
        }}
      >
        <FlatList
          data={chats}
          renderItem={renderChat}
          showsVerticalScrollIndicator={false}
          ref={chatRef}
          removeClippedSubviews={false}
        />
      </View>
      {isMenuOpened ? menuOpened() : menuClosed()}
    </KeyboardAvoidingView>
  ) : (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#d7d7d7",
          height: vh / 15,
          width: vw,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View
          style={{
            height: vh / 20,
            position: "absolute",
            left: 0,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Pressable onPress={() => backward()} style={{ marginLeft: 10 }}>
            <IonIcon name={"chevron-back-sharp"} size={25} />
          </Pressable>
          <Text style={{ marginLeft: vw / 40 }}>{otherName}</Text>
        </View>
        <View
          style={{
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Text style={{ fontSize: 20 }}>
            {post.title.length > 8
              ? post.title.slice(0, 8) + "..."
              : post.title}
          </Text>
        </View>
      </View>
      <View
        style={{
          height: isMenuOpened
            ? vh - vh / 15 - vh / 7.5
            : vh - vh / 15 - vh / 12
        }}
      >
        <FlatList
          data={chats}
          renderItem={renderChat}
          showsVerticalScrollIndicator={false}
          ref={chatRef}
        />
      </View>
      {isMenuOpened ? menuOpened() : menuClosed()}
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
    height: vh / 15,
    marginRight: vw / 5,
    width: vw - vw / 10
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
