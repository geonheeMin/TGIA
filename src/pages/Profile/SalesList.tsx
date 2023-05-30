import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import { RootStackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ItemList from "../Board/ItemList";
import Axios from "axios";
import useStore from "../../../store";
import IonIcon from "react-native-vector-icons/Ionicons";


const { width: vw, height: vh } = Dimensions.get("window");

type SalesListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SalesList"
>;

function SalesList({ navigation, route }: SalesListScreenProps) {
  const { session, url } = useStore();
  const [sellerId, setSellerId] = useState(route.params.member_Id); // 받아온 판매자 아이디
  const [nickName, setNickName] = useState(route.params.nickName); // 유저 닉네임
  const [profileImg, setProfileImg] = useState(route.params.profile_Img); // 프로필 이미지
  const [img, setImg] = useState({});
  const [posts, setPosts] = useState([]);

  const goBack = useCallback(() => {
    navigation.goBack();
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
      department: item.department,
      createdDate: item.createdDate,
      item_name: item.item_name
    };

    return <ItemList board={renderBoard} navigation={navigation} />;
  };

  useEffect(() => {
    Axios.get(`${url}/post/my_list?userId=` + sellerId)
      .then((res) => {
        setPosts(res.data);
        posts.sort((a, b) => b.post_id - a.post_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={goBack}
          activeOpacity={0.5}
        >
          <IonIcon name={"chevron-back-sharp"} size={25} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileZone}>
        <View style={styles.titleZone}>
          <View style={styles.title}>
            <Text style={styles.sellerText}>{nickName}님 판매상품</Text>
          </View>
        </View>
        <View style={styles.sellerImageZone}>
          <Image
            source={
              Object.keys(img).length === 0
                ? { uri: `${url}/images/${profileImg}` }
                : { uri: img?.uri }
            }
            style={styles.sellerImage}
          />
        </View>
      </View>

      <View style={styles.salesList}>
        {posts.length >= 1 ? (
          <FlatList
            style={{ marginTop: 0 }}
            data={posts}
            renderItem={renderItem}
          />
        ) : (
          <View style={styles.salesNone}>
            <Text style={styles.salesNoneText}>판매중인 게시물이 없어요.</Text>
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
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
  },

  profileZone: {
    flex: 1.2,
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderBottomColor: "gray"
  },
  titleZone: {
    flex: 2.2,
    marginHorizontal: vw * 0.05
  },
  title: {
    flex: 2,
    justifyContent: "center"
  },
  sellerText: {
    fontSize: 18,
    fontWeight: "600"
  },
  sellerImageZone: {
    flex: 1
  },
  sellerImage: {
    width: "80%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: vh * 0.012,
    borderRadius: 100,
    borderWidth: 0.3
  },
  salesList: {
    flex: 7
  },
  salesNone: {
    position: "absolute",
    alignItems: "center",
    marginVertical: vh / 3,
    left: "27.5%"
  },
  salesNoneText: {
    fontSize: 16,
    color: "gray"
  }
});

export default SalesList;
