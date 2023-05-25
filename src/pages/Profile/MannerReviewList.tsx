import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  TouchableHighlight,
  Animated,
  TouchableOpacity,
  FlatList
} from "react-native";
import { RootStackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Axios from "axios";
import useStore from "../../../store";

const { width: vw, height: vh } = Dimensions.get('window');

type MannerReviewListScreenProps = NativeStackScreenProps<RootStackParamList, "MannerReviewList">;

function MannerReviewList({navigation, route}: MannerReviewListScreenProps) {
  const { session, url } = useStore();
  const [profileImg, setProfileImg] = useState();
  const [img, setImg] = useState({});
  const [posts, setPosts] = useState();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderItem = ({ item }) => {
    const renderBoard = {
      review_id: item.review_id,
      member_id: item.member_id,
      writer: item.writer,
      profileImg: item.profileImg,
      text: item.text,
      date: item.date,
    };

    // return <ItemList board={renderBoard} navigation={navigation} />;
  };

  useEffect(() => {
    // Axios.get(`${url}/manner/my_list?userId=` + sellerId)
    //   .then((res) => {
    //     setPosts(res.data);
    //     posts.sort((a, b) => b.post_id - a.post_id);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  return(
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/design/backIcon.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.topBarName}>
          받은 거래 후기
        </Text>
      </View>
      
      <View style={styles.reviewList}>
        {posts.length >= 1 ? (
          <FlatList
            style={{ marginTop: 0 }}
            data={posts}
            renderItem={renderItem}
          />
        ) : (
          <View style={styles.reviewNone}>
            <Text style={styles.reviewNoneText}>
              판매중인 게시물이 없어요.
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
  topBarName: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: vw / 3.65,
  },
  messageZone: {
    flex: 0.45,
    height: vh * 0.2,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: vw * 0.04,
    borderBottomWidth: 0.4,
    borderColor: "gray",
  }, 


  reviewList: {
    flex : 1,
  },
  reviewNone: {
    position: "absolute",
    alignItems: "center",
    marginVertical: vh / 3,
    left: "27.5%"
  },
  reviewNoneText: {
    fontSize: 16,
    color: "gray"
  },
});

export default MannerReviewList;