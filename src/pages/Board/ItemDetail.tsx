import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  Modal
} from "react-native";
import Axios from "axios";
import useStore from "../../../store";
import fav from "../../assets/design/favorite.png";
import unfav from "../../assets/design/unfavorite.png";
import { useIsFocused } from "@react-navigation/native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { stackScrollInterpolator } from "../../utils/animations";
import { ProgressBar } from "react-native-paper";
import { places } from "../../assets/data/place";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Post } from "../../types/PostType";

type RootStackParamList = {
  Detail: undefined;
};
type ItemDetailProps = NativeStackScreenProps<RootStackParamList, "Detail">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ItemDetail({ route, navigation }: ItemDetailProps) {
  const { session, url } = useStore();
  const board = route.params.board;
  const location = places.filter((item) => board.locationType === item.label)[0]
    .image;
  const [sellerPosts, setSellerPosts] = useState([]);
  const [sellerColumn, setSellerColumn] = useState(1);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [writer, setWriter] = useState("");
  const [writerImage, setWriterImage] = useState("");
  const [pressed, setPressed] = useState(false);
  const [category, setCategory] = useState("");
  const [chatroom, setChatroom] = useState();
  const timestamp = board.createdDate;
  const [isFav, setIsFav] = useState(route.params.isFav);
  const [isFavOn, setIsFavOn] = useState(false);
  const isFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [manner, setManner] = useState(455); // 매너 학점
  const [mannerGrade, setMannerGrade] = useState(""); // 매너 등급
  const moment = require("moment");
  const date = new moment(timestamp);
  const toUpdate = useCallback(() => {
    navigation.navigate("Add", { board: board });
  }, [board, navigation]);

  const timeCalc = () => {
    const now = new moment();
    const gapTime = now.diff(date, "minutes");
    const gapHour = now.diff(date, "hours");
    const gapDay = now.diff(date, "days");
    const isAm = date.format("A") === "AM" ? "오전" : "오후";
    if (gapTime < 1) {
      return "방금 전";
    } else if (gapTime < 60) {
      return `${gapTime}분 전`;
    } else if (gapHour < 24) {
      return `${gapHour}시간 전`;
    } else if (gapDay < 7) {
      return `${gapDay}일 전`;
    } else {
      return `${date.format(`YYYY년 M월 D일 ${isAm} 시 m분`)}`;
    }
  };

  const doFav = () => {
    setIsFavOn(!isFavOn);
    Axios.post(
      `${url}/profile/add_favorite`,
      {},
      { params: { postId: board.post_id, userId: session?.member_id } }
    ).then((res) => {
      console.log("좋아요 Id : " + res.data);
    });
  };

  const unFav = () => {
    setIsFavOn(!isFavOn);
    Axios.delete(`${url}/profile/delete_favorite3`, {
      params: { postId: board.post_id, userId: session?.member_id }
    })
      .then((res) => {
        console.log("좋아요 취소");
      })
      .catch((error) => {
        console.log(error);
        console.log("취소 실패");
      });
  };

  const toMyChat = useCallback(() => {
    navigation.navigate("ChatListFromPost", { post: board });
  }, [navigation]);

  const toQuest = useCallback(() => {
    /** Axios.get() 으로 api 접속해서 post_id, memberA, memberB 를 게시글의 post_id, writer, zustand에 저장된 id 로 검색해서
     * 유무 판단해서 있으면 기존 채팅방을 리턴, 없으면 새로 채팅방 만들고 리턴 후 ChatDetail 로 이동
     */
    const chatStartRequestDTO = {
      post_id: board.post_id,
      member_id: session?.member_id
    };
    Axios.post(`${url}/chat/start`, chatStartRequestDTO, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        navigation.navigate("ChatDetail", {
          chatroom: res.data,
          post: board
        });
      })
      .catch((error) => console.log(error));
  }, [board, chatroom, navigation]);

  const categorySearch = () => {
    navigation.navigate("CategorySearch", { category: board.category });
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
    Axios.get(
      `${url}/post/details3?postId=${board.post_id}&userId=${session?.member_id}`
    )
      .then((res) => {
        console.log(res.data.sellerPosts);
        if (res.data.sellerPosts > 0) {
          setSellerPosts(res.data.sellerPosts);
          setSellerColumn(
            res.data.sellerPosts.length / 2 + (res.data.sellerPosts.length % 2)
          );
        }
        if (res.data.postsByCategory.length > 0) {
          setCategoryPosts(
            res.data.postsByCategory.filter(
              (item) => item.post_id !== board.post_id
            )
          );
        }
      })
      .catch((error) => console.log(error));
    Axios.get(`${url}/member/get_username?id=${board.member_id}`)
      .then((res) => {
        setWriter(res.data);
      })
      .catch((err) => console.log(err));
    Axios.get(`${url}/member/get_image?member_id=${board.member_id}`)
      .then((res) => {
        setWriterImage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    Axios.get(`${url}/get_seller_profile?userId=` + session?.member_id)
    .then((res) => {
      setManner(res.data.profileListDto.mannerscore);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    //Axios.get(`${url}`);
    matchingCategories();
  }, [isFav]);

  const DATA = board?.images?.map((item, index) => {
    return {
      id: index,
      image: { uri: `${url}/images/${item}` }
    };
  });

  const renderCarouselItem = ({ item, index }) => {
    return (
      <Pressable onPress={() => setModalVisible(index)}>
        <View style={styles.carouselItemContainer}>
          <Image source={item.image} style={styles.carouselImage} />
        </View>
      </Pressable>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderPagination = useCallback(() => {
    return (
      <Pagination
        dotsLength={DATA.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotOpacity={0.6}
        inactiveDotScale={0.7}
      />
    );
  }, [activeIndex]);

  const toMannerInfo = () => {
    navigation.navigate("MannerInfo", {
      member_Id: board.member_id
    });
  };

  useEffect(() => {
    if (manner >= 600) {
      setMannerGrade("A+");
    } else if (manner >= 500) {
      setMannerGrade("A0");
    } else if (manner >= 400) {
      setMannerGrade("B+");
    } else if (manner >= 300) {
      setMannerGrade("B0");
    } else if (manner >= 200) {
      setMannerGrade("C+");
    } else if (manner >= 100) {
      setMannerGrade("C0");
    } else {
      setMannerGrade("D0");
    }
  }, [manner]);

  const toSalesList = useCallback(() => {
    navigation.navigate("SalesList", {
      member_Id: board.member_id,
      //profile_Img: profileImg,
      nickName: board.writer
    });
  }, [navigation]);

  const renderAssociatedItem = (item: Post, index: number) => {
    let isFav = 0;
    Axios.get(`${url}/profile/is_favorite`, {
      params: { postId: item.post_id, userId: session?.member_id }
    })
      .then((res) => {
        isFav = res.data;
      })
      .catch((error) => {});
    const toAssociatedItem = () => {
      navigation.push("Detail", { board: item, isFav: isFav });
    };
    return (
      <Pressable
        key={index}
        style={{
          width: (vw - 30) / 2,
          height: vh / 5 - 10,
          marginBottom: 10,
          paddingTop: 5,
          paddingHorizontal: 10
        }}
        onPress={() => toAssociatedItem()}
      >
        <Image
          source={{ uri: `${url}/images/${item.images[0]}` }}
          style={{
            width: (vw - 30) / 2 - 20,
            height: (vh / 5 - 10) / 1.75,
            borderWidth: 1,
            borderColor: "lightgrey",
            borderRadius: 10
          }}
        />
        <Text style={{ marginTop: 5, fontSize: 16, fontWeight: "600" }}>
          {item.title.length > 13
            ? item.title.slice(0, 11) + "..."
            : item.title}
        </Text>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "flex-end"
          }}
        >
          <View>
            <Text style={{ color: "grey" }}>{item.locationType}</Text>
          </View>
          <View style={{ position: "absolute", right: 0 }}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>
              {isNaN(item.price) ? item.price : item.price.toLocaleString()}원
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

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
        <Modal
          visible={modalVisible !== false}
          onRequestClose={closeModal}
          animationType="fade"
          presentationStyle="overFullScreen"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable onPress={closeModal}>
                <Text style={styles.modalCloseButton}>X</Text>
              </Pressable>
            </View>
            <Image
              source={DATA[activeIndex].image}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
        <View style={styles.content}>
          <Pressable onPress={toMannerInfo} style={styles.postWriterBar}>
            <Image
              source={{ uri: `${url}/images/${writerImage}` }}
              style={styles.writerImage}
            />
            <View style={styles.writerProps}>
              <View style={styles.propsTop}>
                <Text style={{ fontSize: 20 }}>{writer}</Text>
              </View>
              <View style={styles.propsBottom}>
                <Text style={{ fontSize: 14 }}>{session?.firstTrack}</Text>
              </View>
            </View>
            {session?.member_id === board.member_id ? (
              <View style={styles.postSetting}>
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
            ) : (
              <View style={styles.mannerInfo}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.mannerText}>매너학점</Text>
                  <Text style={styles.mannerGrade}>{mannerGrade}</Text>
                </View>
                <View style={{ marginTop: 8, paddingRight: 15 }}>
                  <ProgressBar
                    progress={(manner % 100) / 100}
                    color={"#3064e7"}
                    style={styles.progress}
                  />
                </View>
              </View>
            )}
          </Pressable>
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
            <Pressable onPress={() => categorySearch()}>
              <View>
                <Text
                  style={{
                    color: "#a6a6a6",
                    fontSize: 15
                  }}
                >
                  {board.category}
                </Text>
                <View style={{ height: 0.5, backgroundColor: "#a6a6a6" }} />
              </View>
            </Pressable>
            <Text style={{ color: "#a6a6a6", fontSize: 14 }}>
              {" "}
              · {`${timeCalc()}`}
            </Text>
          </View>
          <Text style={styles.postContent}>{board.text}</Text>
        </View>
        <View style={styles.hr} />
        {/* 소 표시 */}
        <View style={styles.postLocationArea}>
          <View style={styles.postLocationTitleBar}>
            <View style={styles.postLocationTitleLeft}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                거래 희망 장소
              </Text>
            </View>
            <View style={styles.postLocationTitleRight}>
              <Text style={{ color: "grey" }}>{board.locationType}</Text>
            </View>
          </View>
          <View style={styles.postLocationMap}>
            <View>
              <Image
                source={location}
                style={{
                  width: 360,
                  height: 240,
                  borderWidth: 1,
                  borderColor: "lightgrey"
                }}
              />
            </View>
          </View>
        </View>

        <Pressable onPress={toSalesList} style={styles.salesListButton}>
          <Text style={styles.salesListButtonText}>
            {writer}님이 판매중인 상품
          </Text>
          <SimpleLineIcons
            name="arrow-right"
            size={20}
            style={styles.salesListButtonArrow}
          />
        </Pressable>
        {sellerPosts.length > 0 ? (
          <View
            style={[styles.sameWriterArea, { height: (vh / 5) * sellerColumn }]}
          >
            <View style={[styles.sameWriterLeft]}></View>
            <View style={[styles.sameWriterRight]}></View>
          </View>
        ) : (
          <View
            style={[
              styles.sameWriterArea,
              {
                height: (vh / 5) * sellerColumn,
                justifyContent: "center",
                alignItems: "center"
              }
            ]}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "lightgrey" }}
            >
              {writer} 님의 다른 게시글이 없습니다.
            </Text>
          </View>
        )}
        <View style={styles.hr} />
        <Pressable
          onPress={() => categorySearch()}
          style={styles.sameCategoryTitle}
        >
          <Text style={styles.salesListButtonText}>이 글은 어떠세요?</Text>
          <SimpleLineIcons
            name="arrow-right"
            size={20}
            style={styles.salesListButtonArrow}
          />
        </Pressable>

        {categoryPosts.length > 0 ? (
          <View style={styles.sameCategoryArea}>
            <View style={styles.sameCategoryLeft}>
              {categoryPosts.map((item, index) => {
                if (index < 4 && index % 2 === 0) {
                  return renderAssociatedItem(item, index);
                }
              })}
            </View>
            <View style={styles.sameCategoryRight}>
              {categoryPosts.map((item, index) => {
                if (index < 4 && index % 2 === 1) {
                  return renderAssociatedItem(item, index);
                }
              })}
            </View>
          </View>
        ) : null}
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
              {!isNaN(board.price) ? board.price.toLocaleString() : undefined}원
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
            onPress={
              board.member_id === session?.member_id ? toMyChat : toQuest
            }
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              {board.member_id === session?.member_id ? "채팅목록" : "문의하기"}
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
    alignItems: "center",
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
    width: vw,
    height: vh * 0.5
  },
  carouselItemContainer: {
    width: vw,
    height: vh / 1.9,
    justifyContent: "center",
    alignItems: "center"
  },
  carouselImage: {
    width: vw * 1.12,
    height: vh * 0.8
  },
  paginationContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 10
  },
  paginationDot: {
    width: 6,
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.92)"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: vh / 10
  },
  modalHeader: {
    top: vh / 9,
    right: vw / 2.3,
    zIndex: 2,
    padding: 20
  },
  modalCloseButton: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold"
  },
  modalImage: {
    width: vw,
    height: vh
  },
  mannerInfo: {
    width: vw / 4.5,
    height: vh / 26
  },
  mannerText: {
    fontSize: 16,
    textAlign: "left"
  },
  mannerGrade: {
    fontSize: 14,
    color: "#3064e7",
    fontWeight: "500",
    marginLeft: vw * 0.008
  },
  mannerExp: {
    fontSize: 16,
    textAlign: "right",
    marginRight: vw * 0.04,
    color: "#3064e7",
    fontWeight: "500"
  },
  progress: {
    height: vh * 0.01,
    borderRadius: 30
  },
  salesListButton: {
    height: vh * 0.07,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.4,
    borderTopColor: "gray",
    borderBottomWidth: 0.4,
    borderBottomColor: "gray"
  },
  salesListButtonText: {
    fontSize: 18,
    marginLeft: vw * 0.03,
    fontWeight: "700"
  },
  salesListButtonArrow: {
    fontWeight: "700",
    marginRight: vw * 0.03
  },
  postLocationArea: {
    width: vw,
    height: 300
  },
  postLocationTitleBar: {
    flexDirection: "row",
    marginHorizontal: 10,
    height: 40,
    alignItems: "center"
  },
  postLocationTitleLeft: {},
  postLocationTitleRight: { position: "absolute", right: 10 },
  postLocationMap: {
    marginHorizontal: 20,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  sameWriterArea: {
    width: vw - 20,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: "row"
  },
  sameWriterLeft: {
    width: (vw - 20) / 2 - 5,
    height: vh - vh / 5
  },
  sameWriterRight: {
    width: (vw - 20) / 2 - 5,
    height: vh - vh / 5,
    marginLeft: 10
  },
  sameCategoryTitle: {
    height: vh * 0.07,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.4,
    borderTopColor: "gray",
    borderBottomWidth: 0.4,
    borderBottomColor: "gray"
  },
  sameCategoryArea: {
    width: vw - 20,
    height: (vh - vh / 5) / 2,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  sameCategoryLeft: {
    width: (vw - 20) / 2 - 5,
    height: (vh - vh / 5) / 2
  },
  sameCategoryRight: {
    width: (vw - 20) / 2 - 5,
    height: (vh - vh / 5) / 2,
    marginLeft: 10
  }
});

export default ItemDetail;
