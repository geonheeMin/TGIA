import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { RootStackParamList } from "../../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Axios from "axios";
import useStore from "../../../store";
import IonIcon from "react-native-vector-icons/Ionicons";

const { width: vw, height: vh } = Dimensions.get('window');

type MannerReviewListScreenProps = NativeStackScreenProps<RootStackParamList, "MannerReviewList">;

function MannerReviewList({navigation, route}: MannerReviewListScreenProps) {
  const { session, url } = useStore();
  const [memberId, setMemberId] = useState(route.params.member_Id); // 받아온 멤버 아이디
  const [purchaseReviews, setPurchaseReviews] = useState([]); // 구매자 리뷰 내용

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    Axios.get(`${url}/get_all_pruchase_review?userId=` + memberId)
    .then((res) => {
      console.log(res.data);
      console.log("dd");
      setPurchaseReviews(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const renderPurchaseReviews = () => {
    const toOtherProfile = (buyerId) => {
      navigation.push("MannerInfo", {
        member_Id: buyerId
      });
    };

    return purchaseReviews.map((review, index) => {
      const { buyer_username, review: reviewText, imageFilename, buyer_id: buyerId } = review;
      return (
        <Pressable
          style={styles.purchaseReviews}
          key={index}
          onPress={() => toOtherProfile(buyerId)}
        >
          <View style={styles.reviewerImageZone}>
            <Image
              source={{ uri: `${url}/images/${imageFilename}` }}
              style={styles.reviewerImage}
            />
          </View>
          <View style={styles.reviewInfo}>
            <Text style={styles.reviewWriter}>{buyer_username}</Text>
            <Text style={styles.reviewText}>{reviewText}</Text>
          </View>
        </Pressable>
      );
    });
  };

  return(
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={goBack}
          activeOpacity={0.5}
        >
          <IonIcon name={"chevron-back-sharp"} size={25} />
        </TouchableOpacity>
        <Text style={styles.topBarText}>거래 후기 상세</Text>
      </View>
      <View style={styles.reviewList}>
        {purchaseReviews.length >= 1 ? 
          renderPurchaseReviews()
        : (
          <View style={styles.reviewNone}>
            <Text style={styles.reviewNoneText}>
              받은 거래 후기가 없어요.
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
  topBarText: {
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
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
    marginVertical: vh * 0.4,
  },
  reviewNoneText: {
    fontSize: 16,
    color: "gray",
    marginLeft: vw * 0.3  
  },
  purchaseReviews: {
    height: vh * 0.1,
    flexDirection: "row",
    marginHorizontal: vw * 0.03,
    marginTop: vh * 0.025,
    borderBottomWidth: 0.4,
    borderBottomColor: "gray",
  },
  reviewerImageZone: {
    flex: 0.4,
  },
  reviewerImage: {
    width: "75%",
    height: "75%",
    borderRadius: 100,
    borderWidth: 0.3,
  },
  reviewInfo: {
    flex: 1.3
  },
  reviewWriter: {
    fontSize: 18,
    fontWeight: "500",
  },
  reviewText: {
    marginTop: vh * 0.01,
    fontSize: 16,
  }
});

export default MannerReviewList;