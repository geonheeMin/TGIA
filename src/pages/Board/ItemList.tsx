import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Image,
  View,
  Dimensions,
  Linking
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import useStore from "../../../store";
import Axios from "axios";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type RootStackParamList = {
  item: undefined;
};
type itemListProps = NativeStackScreenProps<RootStackParamList, "item">;

function ItemList({ board, navigation }: itemListProps) {
  const { session, url } = useStore();
  const [postId, setPostId] = useState(board.post_id);
  const [likes, setLikes] = useState(false); // 하트 채워짐 표시
  const [isFav, setIsFav] = useState(0); // 좋아요 정보. 0 : 좋아요 off, 1 : 좋아요 on
  const [favId, setFavId] = useState(0);
  const isFocused = useIsFocused();

  const toDetail = useCallback(() => {
    navigation.navigate("Detail", { board: board, isFav: isFav });
  }, [board, navigation]);

  const favorite = () => {
    Axios.get(`${url}/profile/is_favorite`, {
      params: { postId: board.post_id, userId: session.member_id }
    })
      .then((res) => {
        setIsFav(res.data);
      })
      .catch((error) => {});
  };

  const timeCalc = () => {
    const now = new Date();
    const date = new Date(board.createdDate);
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
      return `${date}`;
    }
  };

  useEffect(() => {
    favorite();
    console.log(board);
  }, [isFocused]);

  return (
    <Pressable style={styles.items} onPress={toDetail}>
      <View style={styles.itemImageZone}>
        {board && board.images && board.images[0] && (
          <Image
            source={{ uri: `${url}/images/${board.images[0]}` }}
            style={styles.itemImage}
          />
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{board.title}</Text>
        <Text style={styles.itemEtc}>
          {board.locationType} · {timeCalc()}
        </Text>
        <Text style={styles.itemPrice}>{board.price.toLocaleString()}원</Text>
      </View>
      <View style={styles.likesInfo}>
        <Text style={styles.itemFavCount}>
          <Entypo name="heart-outlined" size={18} color={"gray"} />
          {board.likes}
        </Text>
      </View>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  items: {
    paddingBottom: 5,
    backgroundColor: "white",
    flexDirection: "row"
  },
  itemImageZone: {
    flex: 1.2,
    paddingVertical: 15
  },
  itemInfo: {
    flex: 2.1
  },
  likesInfo: {
    flex: 0.45
  },
  itemImage: {
    flex: 1,
    width: "85%",
    height: "85%",
    paddingVertical: "39%",
    marginLeft: 18,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 0.3,
    overflow: "hidden"
  },
  itemTitle: {
    fontSize: 16,
    marginTop: 30,
    marginLeft: 15
  },
  itemPrice: {
    fontSize: 19,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 15
  },
  likeButton: {
    marginTop: vh / 40
  },
  itemFavCount: {
    fontSize: 18,
    marginTop: vh / 8.7,
    fontWeight: "300",
    color: "gray"
  },
  itemEtc: {
    color: "grey",
    fontSize: 12.5,
    marginLeft: 15,
    marginTop: 5
  }
});

export default ItemList;
