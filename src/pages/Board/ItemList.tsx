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
import fav from "../../assets/design/favorite.png";
import unfav from "../../assets/design/unfavorite.png";
import useStore from "../../../store";
import Axios from "axios";

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

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
      <View style={styles.likesInfo}>
        <Pressable style={styles.likeButton}>
          <Image
            source={isFav === 0 ? unfav : fav}
            style={{
              width: 25,
              height: 25,
              overflow: "visible"
            }}
          />
          <Text>{isFav}</Text>
        </Pressable>
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
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  itemImageZone: {
    flex: 1.2,
    paddingVertical: 15,
  },
  itemInfo: {
    flex: 2.1,
  },
  likesInfo: {
    flex: 0.45,
  },
  itemImage: {
    flex: 1,
    width: '85%',
    height: '85%',
    paddingVertical: '39%',
    marginLeft: 18,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 0.3,
    overflow: 'hidden'
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 20,
    marginLeft: 16,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 10,
    marginLeft: 16,
  },
  likeButton: {
    marginTop: vh / 40,
  },
  itemFavCount: {
    fontSize: 18,
    marginTop: vh / 23,
    fontWeight: '300',
    color: "gray",
  },
})

export default ItemList;
