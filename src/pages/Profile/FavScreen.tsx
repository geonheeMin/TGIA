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
  FlatList
} from "react-native";
import Axios from "axios";
import ItemList from "../Board/ItemList";
import useStore from "../../../store";
import { useIsFocused } from "@react-navigation/native";

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
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/design/backIcon.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "600", paddingLeft: vw / 40 }}>
          관심목록
        </Text>
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
  contentNone: {
    position: "absolute",
    alignItems: "center",
    marginVertical: vh / 2.6,
    left: "30%"
  },
  contentNoneText: {
    fontSize: 16,
    color: "gray"
  }
});

export default FavScreen;
