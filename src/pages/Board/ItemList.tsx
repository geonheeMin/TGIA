import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  Image,
  View,
  Dimensions
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import useStore from "../../../store";
import Axios from "axios";
import { Post } from "../../types/PostType";
const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type RootStackParamList = {
  board: Post;
};
type itemListProps = NativeStackScreenProps<RootStackParamList, "item">;

function ItemList({ board, navigation }: itemListProps) {
  const { session, url } = useStore();
  const moment = require("moment");
  const [isFav, setIsFav] = useState(0); // 좋아요 정보. 0 : 좋아요 off, 1 : 좋아요 on
  const isFocused = useIsFocused();

  const toDetail = () => {
    navigation.navigate("Detail", { board: board, isFav: isFav });
  };

  const favorite = () => {
    Axios.get(`${url}/profile/is_favorite`, {
      params: { postId: board.post_id, userId: session?.member_id }
    })
      .then((res) => {
        setIsFav(res.data);
      })
      .catch((error) => {});
  };

  const timeCalc = () => {
    const now = new moment();
    const date = new moment(board.createdDate);
    const gapTime = now.diff(date, "minutes");
    const gapHour = now.diff(date, "hours");
    const gapDay = now.diff(date, "days");
    const gapWeek = now.diff(date, "weeks");
    const gapMonth = now.diff(date, "months");
    const gapYear = now.diff(date, "years");
    const isAm = date.format("A") === "AM" ? "오전" : "오후";
    if (gapTime < 1) {
      return "방금 전";
    } else if (gapTime < 60) {
      return `${gapTime}분 전`;
    } else if (gapHour < 24) {
      return `${gapHour}시간 전`;
    } else if (gapDay < 7) {
      return `${gapDay}일 전`;
    } else if (gapWeek < 5) {
      return `${gapWeek}주 전`;
    } else if (gapMonth < 12) {
      return `${gapMonth}개월 전`;
    } else if (gapYear) {
      return `${gapYear}년 전`;
    }
  };

  useEffect(() => {
    favorite();
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            paddingLeft: 10
          }}
        >
          <Text style={styles.itemPrice}>
            {!isNaN(board.price) ? board.price.toLocaleString() : undefined}원
          </Text>
          {board.statusType !== "거래예약" && "거래완료" ? null : (
            <Text
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: board.statusType === "거래예약" ? "grey" : "blue",
                padding: 3,
                color: board.statusType === "거래예약" ? "grey" : "blue"
              }}
            >
              {board.statusType}
            </Text>
          )}
          <View
            style={{ position: "absolute", right: 10, flexDirection: "row" }}
          >
            <Text style={styles.itemViewCount}>
              <Ionicons name="eye-outline" size={15} color={"gray"} />
              {board.views}
            </Text>
            <Text style={styles.itemFavCount}>
              <Entypo name="heart-outlined" size={15} color={"gray"} />
              {board.likes}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  items: {
    paddingBottom: 5,
    backgroundColor: "white",
    flexDirection: "row",
    paddingVertical: 15
  },
  itemImageZone: {
    flex: 1.2
  },
  itemInfo: {
    flex: 2.1
  },
  likesInfo: {
    flexDirection: "row",
    flex: 1
  },
  itemImage: {
    paddingVertical: "39%",
    marginLeft: 18,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: "lightgrey",
    flex: 1,
    width: "85%",
    height: "85%",
    overflow: "hidden"
  },
  itemTitle: {
    fontSize: 16,
    marginTop: 15,
    marginLeft: 15
  },
  itemPrice: {
    fontSize: 19,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  likeButton: {
    marginTop: vh / 40
  },
  itemViewCount: {
    fontSize: 15,
    marginRight: vw / 90,
    fontWeight: "300",
    color: "gray"
  },
  itemFavCount: {
    fontSize: 15,
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
