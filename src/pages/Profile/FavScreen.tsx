import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform
} from "react-native";
import Axios from "axios";
import ItemList from "../Board/ItemList";
import useStore from "../../../store";
import { useIsFocused } from "@react-navigation/native";
import IonIcon from "react-native-vector-icons/Ionicons";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type RootStackParamList = {
  Fav: undefined;
};
type FavScreenProps = NativeStackScreenProps<RootStackParamList, "Fav">;

function FavScreen({ route, navigation }: FavScreenProps) {
  const { session, url } = useStore();
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState([]);

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

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
    Axios.get(`${url}/profile/favorite_list`, {
      params: { userId: session?.member_id }
    })
      .then((res) => {
        setPosts(res.data);
        posts.sort((a, b) => b.post_id - a.post_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={toProfile}
          activeOpacity={0.5}
        >
          <IonIcon name={"chevron-back-sharp"} size={25} />
        </TouchableOpacity>
        <Text style={styles.topBarText}>관심목록</Text>
      </View>
      <View>
        {posts.length >= 1 ? (
          <FlatList data={posts} renderItem={renderItem} />
        ) : (
          <View style={styles.contentNone}>
            <Text style={styles.contentNoneText}>아직 관심 목록이 없어요.</Text>
          </View>
        )}
      </View>
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
    height: Platform.OS === "ios" ? vh / 18 : vh / 15,
    flexDirection: "row",
    alignItems: "center"
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
  },
  topBarText: {
    fontSize: 18,
    fontWeight: "600"
  },
  contentNone: {
    width: vw,
    height: Platform.OS === "ios" ? vh - vh / 18 : vh - vh / 15,
    justifyContent: "center",
    alignItems: "center"
  },
  contentNoneText: {
    fontSize: 16,
    color: "gray"
  }
});

export default FavScreen;
