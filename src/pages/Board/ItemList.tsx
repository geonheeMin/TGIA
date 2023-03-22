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
  View
} from "react-native";
import { styles } from "../../styles/Item/ItemListStyle";
import useStore from "../../../store";
import Axios from "axios";

type RootStackParamList = {
  item: undefined;
};
type itemListProps = NativeStackScreenProps<RootStackParamList, "item">;

function ItemList({ board, navigation }: itemListProps) {
  const { session } = useStore();
  const [postId, setPostId] = useState(board.post_id);
  const toDetail = useCallback(() => {
    navigation.navigate("Detail", { board: board });
  }, [board, navigation]);

  return (
    <Pressable style={styles.items} onPress={toDetail}>
      <View style={styles.itemImageZone}>
        <Image source={{ uri: board.img }} style={styles.itemImage} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{board.title}</Text>
        <Text style={styles.itemPrice}>{board.price}원</Text>
      </View>
    </Pressable>
  );
}

export default ItemList;
