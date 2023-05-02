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
import { useIsFocused } from "@react-navigation/native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { stackScrollInterpolator } from "../../utils/animations";

type RootStackParamList = {
  Detail: undefined;
};
type ItemDetailProps = NativeStackScreenProps<RootStackParamList, "Detail">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ItemDetail({ route, navigation }: ItemDetailProps) {
  const { session, url } = useStore();
  const board = route.params.board;
  // const track = memberlist.memberlist.filter(
  //   (item) => board.writer === item.username
  // )[0].firsttrack;
  const myname = session.username;

  const [pressed, setPressed] = useState(false);
  const [category, setCategory] = useState("");
  const [chatroom, setChatroom] = useState();
  const [chatrooms, setChatrooms] = useState();
  const [diff, setDiff] = useState("");
  const timestamp = board.createdDate;
  const date = new Date(timestamp);
  const [isFav, setIsFav] = useState(route.params.isFav);
  const [isFavOn, setIsFavOn] = useState(false);
  const isFocused = useIsFocused();

  const toUpdate = useCallback(() => {
    navigation.navigate("Add", { board: board });
  }, [board, navigation]);

  const timeCalc = () => {
    const now = new Date();
    const gapTime = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    const gapHour = Math.floor(gapTime / 60);
    const gapDay = Math.floor(gapHour / 24);
    if (gapTime < 1) {
      return "방금 전";
    } else if (gapTime < 60) {
      return `${gapTime}분 전}`;
    } else if (gapHour < 24) {
      return `${gapHour}시간 전`;
    } else if (gapDay < 7) {
      return `${gapDay}일 전`;
    } else {
      return `${timestamp}`;
    }
  };

  const favControll = useEffect(() => {
    if (isFav === 0) setIsFavOn(false);
    else setIsFavOn(true);
  }, [isFocused]);

  const doFav = () => {
    setIsFavOn(!isFavOn);
    Axios.post(
      `${url}/profile/add_favorite`,
      {},
      { params: { postId: board.post_id, userId: session.member_id } }
    ).then((res) => {
      console.log("좋아요 Id : " + res.data);
    });
  };

  const unFav = () => {
    setIsFavOn(!isFavOn);
    Axios.delete(`${url}/profile/delete_favorite3`, {
      params: { postId: board.post_id, userId: session.member_id }
    })
      .then((res) => {
        console.log("좋아요 취소");
      })
      .catch((error) => {
        console.log(error);
        console.log("취소 실패");
      });
  };

  const toMyChat = () => {
    const chatStartRequestDTO = {
      post_id: board.post_id,
      member_id: 6
    };
    Axios.post(`${url}/chat/start`, chatStartRequestDTO, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        console.log("좋아요 취소 : " + favId);
      })
      .catch((error) => {
        console.log(error);
        console.log("취소 실패 : " + favId);
      });
  };

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
          chatroom: res.data,
          post: board
        });
      })
      .catch((error) => console.log(error));
    // navigation.navigate("ChatDetail", {
    //   chatroom: chatroom,
    //   post: board
    // });
  }, [board, chatroom, navigation]);

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
    //Axios.get(`${url}`);
    matchingCategories();
    console.log(board);
  }, [isFav]);

  const DATA = [
    { id: "1", image: require("../../assets/rnbook.png") },
    { id: "2", image: require("../../assets/bugi.png") },
    { id: "3", image: require("../../assets/diptyque.jpg") },
    { id: "4", uri: `${url}/images/${board?.images}` }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const renderCarouselItem = useCallback(({ item }) => {
    return (
      <View style={styles.carouselItemContainer}>
        <Image
          source={item.image}
          style={styles.carouselImage}
          resizeMode="contain"
        />
      </View>
    );
  }, []);

  const renderPagination = useCallback(() => {
    return (
      <Pagination
        dotsLength={DATA.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }, [activeIndex]);

  return (
    <View style={pressed ? { backgroundColor: "black" } : styles.container}>
      <StatusBar barStyle={pressed ? "light-content" : "dark-content"} />
      <ScrollView>
        <View style={styles.carouselContainer}>
          <Carousel
            layout="default"
            data={DATA}
            renderItem={renderCarouselItem}
            sliderWidth={vw}
            itemWidth={vw}
            inactiveSlideOpacity={1}
            onSnapToItem={(index) => setActiveIndex(index)}
            scrollInterpolator={stackScrollInterpolator}
          />
          {renderPagination()}
        </View>
        {/* <Pressable onPress={changeImageState}>
          <Image
            source={{
              uri: `${url}/images/${board?.images}`
            }}
            style={pressed ? styles.pressedImage : styles.postImage}
          />
        </Pressable> */}
        <View style={styles.content}>
          <View style={styles.postWriterBar}>
            <Image source={bugi} style={styles.writerImage} />
            <View style={styles.writerProps}>
              <View style={styles.propsTop}>
                <Text style={{ fontSize: 20 }}>{board.writer}</Text>
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
              · {` ${timeCalc()}`}
            </Text>
          </View>
          <Text style={styles.postContent}>{board.text}</Text>
        </View>
      </ScrollView>
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
            onPress={board.member_id === session.member_id ? toMyChat : toQuest}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              {board.member_id === session.member_id ? "채팅목록" : "문의하기"}
            </Text>
          </Pressable>
        </View>
      </View>
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
    //marginTop: vh / 2.2
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
    fontSize: 15,
    marginHorizontal: 12.5,
    marginTop: 15,
    fontWeight: "400",
    color: "black",
    // height: vh / 4.75,
    height: vh / 4.5
  },
  buttonBar: {
    height: vh / 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vh / 75
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
  },
  carouselContainer: {
    height: vh * 0.48,
    marginTop: vh / 20
  },
  carouselItemContainer: {
    width: vw,
    height: vh / 1.9,
    justifyContent: "center",
    alignItems: "center"
  },
  carouselImage: {
    width: vw,
    height: vh / 2.05
  },
  paginationContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 10
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: "rgba(0, 0, 0, 0.92)"
  }
});

export default ItemDetail;
