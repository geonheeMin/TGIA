import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
  FlatList
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import postlist from "../../assets/dummy/postdata.json"
import { useIsFocused } from "@react-navigation/native";
import useStore from "../../../store";
import Axios from "axios";

type PurchaseHistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PurchaseHistory"
>;


const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function PurchaseHistory({ navigation }: PurchaseHistoryScreenProps) {
  const [purchased, setPurchased] = useState([]);
  const { session, url } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState(
    postlist.postlist.sort((a, b) => b.post_id - a.post_id)
  );
  const [newPosts, setNewPosts] = useState([{}]);

  const onSubmit = useCallback(() => {
    Alert.alert("알림", "ㅎㅇ");
  }, []);

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  type RootStackParamList_2 = {
    item: undefined;
  };
  type itemListProps = NativeStackScreenProps<RootStackParamList_2, "item">;

  function ItemList({ board, navigation }: itemListProps) {
    const { session, url } = useStore();
    const [postId, setPostId] = useState(board.post_id);
    const [isFav, setIsFav] = useState(0);
    const [review, setReview] = useState(1); // 리뷰 했다면 0, 리뷰 안했다면 1
    const isFocused = useIsFocused();
  
    const toDetail = useCallback(() => {    
      navigation.navigate("Detail", { board: board, isFav: isFav });
    }, [board, navigation]);
  
    const toReview = useCallback(() => {
      Alert.alert("리뷰입니다", "네");
    }, []);

    const favorite = () => {
      Axios.get(`${url}/profile/is_favorite`, {params: {postId: board.post_id, userId: session.member_id}})
      .then((res) => {
      console.log(res.data)
      console.log("좋아함");
      setIsFav(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
    };
  
    useEffect(() => {
      favorite();
    }, [isFocused]);

    return (
      <View>
        <Pressable style={styles.items} onPress={toDetail}>
          <View style={styles.itemImageZone}>
            <Image
              source={{
                uri: `${url}/images/${board?.images}`
              }}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{board.title}</Text>
            <Text style={styles.itemPrice}>{board.price}원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn} onPress={toReview}>
          { review === 1
            ? <Text style={styles.reviewText}>거래 후기 남기기</Text> 
            : <Text style={styles.reviewCompliteText}>거래 후기 남기기</Text> 
          }
        </Pressable>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const renderBoard = {
      post_id: item.post_id,
      title: item.title,
      price: item.price,
      locationType: item.locationType,
      location_text: item.location_text,
      writer: item.writer,
      category: item.category,
      text: item.text,
      date: item.date,
      track: item.track,
      images: item.images,
      member_id: item.member_id,
      likes: item.likes,
      views: item.views,
      createdDate: item.createdDate
    };
    return <ItemList board={renderBoard} navigation={navigation} />;
  };
  
  useEffect(() => {
    Axios.get(`${url}/post/buy_list?userId=` + session.member_id)
    .then((res) => {
      setPosts(res.data);
      posts.sort((a, b) => b.post_id - a.post_id);
      setNewPosts(posts);
      console.log("완료11");
    })
    .catch((error) => {
      console.log(error);
      console.log(posts);
    });
    console.log(posts);
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={toProfile}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/design/backIcon.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "600", paddingLeft: vw / 40 }}>
          구매내역
        </Text>
      </View>

      <View>
        {posts.length >= 1 ? 
          <FlatList
          style={{marginTop: 0}}
          data={posts}
          renderItem={renderItem}
          refreshing={isRefreshing}
          />
            :
            <View style={styles.contentNone }>
              <Text style={styles.contentNoneText}>
                구매 내역이 없어요.
              </Text>
              <Text style={styles.contentNoneText}>
                학우들과 교류하며 거래를 해보세요.
              </Text>
            </View>     
          }
      </View>

      {/* <ScrollView>
        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/airpod.jpg")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 3세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn} onPress={onSubmit}>
          <Text style={styles.reviewText}>거래 후기 남기기</Text>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/diptyque.jpg")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>딥티크 향수 팔아요</Text>
            <Text style={styles.itemPrice}>150,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn}>
          <Text style={styles.reviewCompliteText}>후기 작성 완료</Text>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/rnbook.png")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>리액트 네이티브 책 팝니다</Text>
            <Text style={styles.itemPrice}>25,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn}>
          <Text style={styles.reviewCompliteText}>후기 작성 완료</Text>
        </Pressable>
      </ScrollView> */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "white",
    flex: 1
  },
  topBar: {
    borderBottomWidth: 0.2,
    borderColor: "gray",
    height: vh / 18,
    flexDirection: "row",
    alignItems: "center"
  },
  backButton: {
    width: vw / 22,
    height: vh / 36
  },
  backButtonImg: {
    width: vw / 12,
    height: vh / 28,
    marginLeft: vw / 50
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
  },
  compliteButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: "auto",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 20
  },
  items: {
    paddingBottom: vh / 150,
    backgroundColor: "white",
    flexDirection: "row"
  },
  itemImageZone: {
    flex: 1,
    paddingVertical: vh / 60,
  },
  itemInfo: {
    flex: 2
  },
  itemImage: {
    flex: 1,
    width: "85%",
    height: "85%",
    paddingVertical: "39%",
    marginLeft: vw / 20.5,
    marginTop: vh / 140,
    borderRadius: 8,
    borderWidth: 0.3
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: vh / 45,
    marginLeft: vw / 25,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: vh / 90,
    marginLeft: vw / 25,
  },
  reviewBtn: {
    backgroundColor: "white",
    paddingVertical: vh / 86,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#EEEEEE"
  },
  reviewText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3064e7",
    textAlign: "center"
  },
  reviewCompliteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    textAlign: "center",
  },
  contentNone: {
    position: "absolute",
    alignItems: "center",
    marginVertical: vh / 2.6,
    left: "22%"
  },
  contentNoneText: {
    fontSize: 16,
    color: "gray",
  },
});

export default PurchaseHistory;
