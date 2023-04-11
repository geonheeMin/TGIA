import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ListRenderItem,
  Dimensions,
  TouchableOpacity,
  Image,
  Pressable,
  StatusBar,
  PixelRatio
} from "react-native";
import Axios from "axios";
import ItemList from "./ItemList";
import useStore from "../../../store";
import memberlist from "../../assets/dummy/member.json";
import chatlist from "../../assets/dummy/chatlist.json";
import bugi from "../../assets/bugi.png";
import fav from "../../assets/design/favorite.png";
import unfav from "../../assets/design/unfavorite.png";

type RootStackParamList = {
  Detail: undefined;
};
type ItemDetailProps = NativeStackScreenProps<RootStackParamList, "Detail">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ItemDetail({ route, navigation }: ItemDetailProps) {
  const { session, url } = useStore();
  const board = route.params.board;
  const writer = board.writer;
  // const track = memberlist.memberlist.filter(
  //   (item) => board.writer === item.username
  // )[0].firsttrack;
  const myname = session.username;
  //const [isFav, setIsFav] = useState("");
  const [pressed, setPressed] = useState(false);
  const [category, setCategory] = useState("");
  const [chatroom, setChatroom] = useState();
  const timestamp = board.createdDate;
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
  const [isFav, setIsFav] = useState(route.params.isFav);
  const [isFavOn, setIsFavOn] = useState(false);
  const [favId, setFavId] = useState(0);

  const toUpdate = useCallback(() => {
    navigation.navigate("Add", { board: board });
  }, [board, navigation]);

  const favControll = useEffect(() => {
    if (isFav === 0 )
      setIsFavOn(false);
    else
      setIsFavOn(true);
  }, []);

  const doFav = () => {
    setIsFavOn(!isFavOn);
    Axios.post(
      `${url}/profile/add_favorite`,
      {},
      { params: { postId: board.post_id, userId: session.member_id } }
    ).then((res) => {
      console.log("좋아요 Id : " + res.data);
      setFavId(res.data);
      //console.log(`${board.post_id} 와 ${session.member_id} 전송 성공`);
    });
  };

  const unFav = () => {
    setIsFavOn(!isFavOn);
    Axios.delete(`${url}/profile/delete_favorite`, { params: { favoriteId: favId } })
    .then((res) => {
      console.log("좋아요 취소 : " + favId);
    })
    .catch((error) => {
      console.log(error);
      console.log("취소 실패 : " + favId)
    });
  }

  // const chatroom = chatlist.chatlist.filter(
  //   (item) => item.post_id === board.post_id && item.memberB === session.user_id
  // )[0]?.chatroom_id;
  const toMyChat = useCallback(() => {
    const chatStartRequestDTO = {
      post_id: board.post_id,
      member_id: 6
    };
    Axios.post(`${url}/chat/start`, chatStartRequestDTO, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        console.log(res.data);
        navigation.navigate("ChatDetail", {
          chatroom: res.data.chatroom_id,
          post: board
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [navigation]);
  const toQuest = useCallback(() => {
    /** Axios.get() 으로 api 접속해서 post_id, memberA, memberB 를 게시글의 post_id, writer, zustand에 저장된 id 로 검색해서
     * 유무 판단해서 있으면 기존 채팅방을 리턴, 없으면 새로 채팅방 만들고 리턴 후 ChatDetail 로 이동
     */
    const chatStartRequestDTO = {
      post_id: board.post_id,
      member_id: session.member_id
    };
    console.log(chatStartRequestDTO);
    Axios.post(`${url}/chat/start`, chatStartRequestDTO, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        console.log(res.data);
        navigation.navigate("ChatDetail", {
          chatroom: res.data.chatroom_id,
          post: board
        });
      })
      .catch((error) => console.log(error));
    // navigation.navigate("ChatDetail", {
    //   chatroom: chatroom,
    //   post: board
    // });
  }, [board, chatroom, navigation]);

  const favorite = () => {
    // isFav === '관심 등록'
    //   ? Axios.post(
    //       'http://localhost:8080/api/favorite',
    //       {},
    //       {params: {board_id: board.id, user_id: id}},
    //     ).then(() => setIsFav('관심 해제'))
    //   : Axios.post(
    //       'http://localhost:8080/api/unfavorite',
    //       {},
    //       {params: {board_id: board.id, user_id: id}},
    //     ).then(() => setIsFav('관심 등록'));
  };

  const changeImageState = () => {
    setPressed(!pressed);
  };

  const matchingCategories = () => {
    switch (board.category) {
      case "book":
        setCategory("도서");
        break;
      case "pencil":
        setCategory("필기구");
        break;
      case "clothes":
        setCategory("의류");
        break;
      case "digital":
        setCategory("디지털 기기");
        break;
      case "beauty":
        setCategory("뷰티/미용");
        break;
      case "goods":
        setCategory("부기 굿즈");
        break;
    }
  };

  useEffect(() => {
    // Axios.get('http://localhost:8080/api/favorite', {
    //   params: {board_id: board.id, user_id: id},
    // }).then(res => {
    //   console.log(res.data);
    //   res.data === 1 ? setIsFav('관심 해제') : setIsFav('관심 등록');
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    matchingCategories();
  }, [isFav]);

  return (
    <View style={pressed ? { backgroundColor: "black" } : styles.container}>
      <StatusBar barStyle={pressed ? "light-content" : "dark-content"} />
      <ScrollView>
        <Pressable onPress={changeImageState}>
          <Image
            source={{
              uri: `${url}/images/${board?.images}`
            }}
            style={pressed ? styles.pressedImage : styles.postImage}
          />
        </Pressable>
        <View style={styles.content}>
          <View style={styles.postWriterBar}>
            <Image source={bugi} style={styles.writerImage} />
            <View style={styles.writerProps}>
              <View style={styles.propsTop}>
                <Text style={{ fontSize: 20 }}>{writer}</Text>
              </View>
              <View style={styles.propsBottom}>
                <Text>{session.firsttrack}</Text>
              </View>
            </View>
            <View
              style={
                session.member_id === board.member_id
                  ? styles.postSetting
                  : { zIndex: -10, opacity: 0 }
              }
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Pressable style={styles.updateButton} onPress={toUpdate}>
                  <Text>수정</Text>
                </Pressable>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Pressable style={styles.deleteButton}>
                  <Text>삭제</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.postTitle}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "400",
                color: "black"
              }}
            >
              {board.title}
            </Text>
          </View>
          <View style={styles.postEtc}>
            <Pressable>
              <View style={{}}>
                <Text
                  style={{
                    color: "#a6a6a6",
                    fontSize: 14
                  }}
                >
                  {board.category}
                </Text>
              </View>
            </Pressable>
            <Text style={{ color: "#a6a6a6", fontSize: 14 }}>
              {" "}
              · {diff}분 전
            </Text>
          </View>
          <Text style={styles.postContent}>{board.text}</Text>
          <View style={styles.hr} />
          <View style={styles.buttonBar}>
            <View style={styles.favButton}>
              <Pressable onPress={isFavOn ? unFav : doFav}>
                <Image
                  source={isFavOn ? fav : unfav}
                  style={{
                    width: 30,
                    height: 30,
                    overflow: "visible"
                  }}
                />
              </Pressable>
            </View>
            <View style={styles.vr} />
            <View style={styles.priceBar}>
              <View style={styles.priceText}>
                <Text style={{ fontSize: 20 }}>
                  {board.price.toLocaleString()}원
                </Text>
              </View>
              <View style={styles.nego}>
                <Text style={{ fontSize: 12, color: "#7b7b7c" }}>
                  가격 협상 불가
                </Text>
              </View>
            </View>
            <View style={styles.functionalSpace}>
              <Pressable
                style={styles.functionalButton}
                onPress={board.writer === myname ? toMyChat : toQuest}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                  {board.member_id === session.member_id
                    ? "채팅목록"
                    : "문의하기"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hr: {
    height: 0,
    borderBottomWidth: 0.34,
    width: vw - vw / 20,
    marginLeft: vw / 40,
    borderColor: "#a8a8a8"
  },
  vr: {
    height: vh / 14,
    width: 0,
    borderLeftWidth: 0.33,
    borderColor: "#a8a8a8"
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    marginTop: vh / 2.2
  },
  postWriterBar: {
    flexDirection: "row",
    alignItems: "center",
    height: vh / 10,
    width: vw - vw / 4,
    paddingLeft: 10
  },
  writerImage: {
    width: 55,
    height: 55,
    borderWidth: 0.1,
    borderRadius: 55,
    overflow: "hidden"
  },
  writerProps: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 10
  },
  propsTop: {
    height: vh / 20,
    paddingTop: 20,
    width: vw - vw / 2.25,
    marginLeft: -2,
    justifyContent: "center"
  },
  propsBottom: {
    height: vh / 20,
    width: vw - vw / 2.25,
    paddingBottom: 20,
    justifyContent: "center"
  },
  postImage: {
    width: vw,
    height: vh / 2.2,
    overflow: "hidden",
    position: "absolute"
  },
  pressedImage: {
    width: vw,
    height: vh / 1.35,
    backgroundColor: "black",
    marginVertical: vh / 10
  },
  postSetting: {
    width: vw / 4.5,
    height: vh / 12.5,
    borderWidth: 1,
    marginHorizontal: 5,
    alignItems: "center"
  },
  updateButton: {
    justifyContent: "center",
    alignItems: "center",
    width: vw / 5.5,
    height: vh / 32,
    borderRadius: 30,
    backgroundColor: "#c3c2d0"
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: vw / 5.5,
    height: vh / 32,
    borderRadius: 30,
    backgroundColor: "#c3c2d0"
  },
  postTitle: {
    FlexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 5
  },
  postEtc: {
    flexDirection: "row",
    marginLeft: 15
  },
  postContent: {
    fontSize: 12,
    marginHorizontal: 12.5,
    marginTop: 15,
    fontWeight: "400",
    color: "black",
    // height: vh / 4.75,
    height: vh / 5.75,
    borderWidth: 0
  },
  buttonBar: {
    height: vh / 12,
    flexDirection: "row",
    alignItems: "center"
  },
  favButton: {
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center"
  },
  priceBar: {
    height: 65,
    width: vw - vw / 2.1,
    marginRight: 5,
    marginLeft: 5
  },
  priceText: {
    width: vw - vw / 2.1,
    height: 32.5,
    flowDirection: "column",
    justifyContent: "flex-end",
    paddingLeft: 5
  },
  nego: {
    height: 32.5,
    paddingLeft: 10
  },
  functionalSpace: {
    width: vw - vw / 1.37,
    height: vh / 17,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  functionalButton: {
    width: 95,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#0b60fe",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ItemDetail;
