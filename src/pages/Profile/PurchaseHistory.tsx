import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  Platform
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { useIsFocused } from "@react-navigation/native";
import useStore from "../../../store";
import Axios from "axios";
import ItemList from "../Board/ItemList";
import IonIcon from "react-native-vector-icons/Ionicons";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type PurchaseHistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PurchaseHistory"
>;

function PurchaseHistory({ navigation }: PurchaseHistoryScreenProps) {
  const { session, url } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState([]);

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  const renderItem = ({ item }) => {
    const toReview = () => {
      navigation.navigate("MannerReview", {
        seller_name: item.writer,
        seller_Id: item.member_id,
        post_Id: item.post_id
      });
    };

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
      department: item.department,
      createdDate: item.createdDate,
      item_name: item.item_name,
      purchased: item.purchased,
      reviewType: item.reviewType,
      statusType: item.statusType
    };

    return (
      <View>
        <ItemList board={renderBoard} navigation={navigation} />
        {item.reviewType === "후기완료" ? (
          <View style={styles.reviewButton}>
            <Text style={styles.reviewCompliteText}>후기 작성 완료</Text>
          </View>
        ) : (
          <Pressable style={styles.reviewButton} onPress={toReview}>
            <Text style={styles.reviewText}>거래 후기 남기기</Text>
          </Pressable>
        )}
      </View>
    );
  };

  useEffect(() => {
    Axios.get(`${url}/post/buy_list?userId=` + session?.member_id)
      .then((res) => {
        setPosts(res.data);
        posts.sort((a, b) => b.post_id - a.post_id);
      })
      .catch((error) => {
        console.log("buy" + error);
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
        <Text style={styles.topBarText}>구매내역</Text>
      </View>

      <View>
        {posts.length >= 1 ? (
          <FlatList
            style={{ marginTop: 0 }}
            data={posts}
            renderItem={(item) => renderItem(item)}
            refreshing={isRefreshing}
          />
        ) : (
          <View style={styles.contentNone}>
            <Text style={styles.contentNoneText}>구매 내역이 없어요.</Text>
            <Text style={styles.contentNoneText}>
              학우들과 교류하며 거래를 해보세요.
            </Text>
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
  reviewButton: {
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
    textAlign: "center"
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

export default PurchaseHistory;
