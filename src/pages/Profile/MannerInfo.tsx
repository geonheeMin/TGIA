import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProgressBar } from "react-native-paper";
import useStore from "../../../store";
import Axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import IonIcon from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const { width: vw, height: vh } = Dimensions.get("window");

type MannerInfoPramList = {
  MannerInfo: undefined;
};
type MannerInfoProps = NativeStackScreenProps<MannerInfoPramList, "MannerInfo">;

function MannerInfo({ navigation, route }: MannerInfoProps) {
  const { session, url } = useStore();
  const [memberId, setMemberId] = useState(route.params.member_Id); // 받아온 멤버 아이디
  const [nickName, setNickName] = useState(); // 유저 닉네임
  const [profileImg, setProfileImg] = useState(); // 프로필 이미지
  const [img, setImg] = useState({});
  const [trackFirst, setTrackFirst] = useState(session?.firstTrack); // 제 1트랙
  const [trackSecond, setTrackSecond] = useState(session?.secondTrack); // 제 2트랙
  const [manner, setManner] = useState(455); // 매너 학점
  const [mannerGrade, setMannerGrade] = useState(""); // 매너 등급
  const [subscription, setSubsction] = useState("2023년 6월 2일"); // 가입 날짜
  const [reDealingRate, setReDealingRate] = useState(100); // 재거래 희망률
  const [responseRate, setResponseRate] = useState(100); // 응답률
  const [reviewData, setReviewData] = useState([]); // 받은 매너평가 순위 담는 배열
  const [reviewCount, setReviewCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0); // 판매중인 게시물 개수
  const [purchaseReviews, setPurchaseReviews] = useState([]); // 구매자 리뷰 내용
  const isFocused = useIsFocused();

  function updateReDealingRate(data) {
    const reDealingRateValue = data.find((item) =>
      item.hasOwnProperty("reDealingRate")
    );
    if (reDealingRateValue) {
      setReDealingRate(reDealingRateValue.reDealingRate);
    }
  }

  function updateReviewRanking(data) {
    const reviewDataValue = data.filter(
      (item) => !item.hasOwnProperty("reDealingRate")
    );
    setReviewData(reviewDataValue);
  }

  useEffect(() => {
    Axios.get(`${url}/get_seller_profile?userId=` + memberId)
      .then((res) => {
        setNickName(res.data.profileListDto.username);
        setTrackFirst(res.data.profileListDto.firstTrack);
        setTrackSecond(res.data.profileListDto.secondTrack);
        setProfileImg(res.data.profileListDto.imageFileName);
        setManner(res.data.profileListDto.mannerscore);
        setSubsction(res.data.createdDate);
        setSalesCount(res.data.countSellPostbyUser);
        setReviewCount(res.data.purchaseReview_전체개수);
        setPurchaseReviews(res.data.latestPurchaseReviews);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    Axios.get(`${url}/manner/getTop3AndDealingRate?userId=` + memberId)
      .then((res) => {
        updateReDealingRate(res.data);
        updateReviewRanking(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log("manner 에러" + error);
      });
  }, [isFocused]);

  useEffect(() => {
    if (manner >= 600) {
      setMannerGrade("A+");
    } else if (manner >= 500) {
      setMannerGrade("A0");
    } else if (manner >= 400) {
      setMannerGrade("B+");
    } else if (manner >= 300) {
      setMannerGrade("B0");
    } else if (manner >= 200) {
      setMannerGrade("C+");
    } else if (manner >= 100) {
      setMannerGrade("C0");
    } else {
      setMannerGrade("D0");
    }
  }, [manner]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const toSalesList = () => {
    navigation.navigate("SalesList", {
      member_Id: memberId,
      profile_Img: profileImg,
      nickName: nickName
    });
  };

  // const toOtherProfile = useCallback((buyerId) => {
  //   navigation.navigate("MannerInfo", {
  //     member_Id: buyerId
  //   })
  // }, [])

  const toMannerReviewList = useCallback(() => {
    navigation.navigate("MannerReviewList", {
      member_Id: memberId
    });
  }, []);

  const renderPurchaseReviews = () => {
    const toOtherProfile = (buyerId) => {
      navigation.push("MannerInfo", {
        member_Id: buyerId
      });
    };

    return purchaseReviews.map((review, index) => {
      const {
        buyer_username,
        review: reviewText,
        imageFilename,
        buyer_id: buyerId
      } = review;
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
        <Text style={styles.topBarText}>프로필</Text>
      </View>
      <ScrollView>
        <View style={styles.profile}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={{
                uri: `${url}/images/${profileImg}`
              }}
              style={styles.profileImg}
            />
          </View>
          <View
            style={{
              flex: 0.8,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ fontSize: 16 }}>{nickName}</Text>
          </View>
          <View style={{ flex: 2, paddingVertical: 18 }}>
            <View style={styles.trackzone}>
              <View style={styles.trackbox}>
                <Text style={{ color: "white" }}>{trackFirst}</Text>
              </View>
            </View>
            <View style={styles.trackzone}>
              <View style={styles.trackbox}>
                <Text style={{ color: "white" }}>{trackSecond}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.mannerStatus}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.mannerText}>매너 학점</Text>
            <Text style={styles.mannerGrade}>{mannerGrade}</Text>
            <Text style={styles.mannerExp}>{(manner % 100) + "%"}</Text>
          </View>
          <View style={{ marginTop: 10, paddingRight: 15 }}>
            <ProgressBar
              progress={(manner % 100) / 100}
              color={"#3064e7"}
              style={styles.progress}
            />
          </View>
        </View>
        <View style={styles.subscriptionZone}>
          <Text style={styles.dateOfSubscription}>가입 날짜</Text>
          <Text style={styles.dateOfSubscriptionData}>{subscription}</Text>
        </View>
        <View style={styles.statsZone}>
          <Entypo
            name="heart-outlined"
            size={20}
            color={"gray"}
            style={styles.statusIndent}
          />
          <Text style={styles.statsText}>재거래 희망률 {reDealingRate}%</Text>
          <IonIcon name="chatbubble-outline" size={18} color={"gray"} />
          <Text style={styles.statsText}>응답률 {responseRate}%</Text>
        </View>

        <Pressable onPress={toSalesList} style={styles.salesListButton}>
          <Text style={styles.salesListButtonText}>
            판매상품 {salesCount}개
          </Text>
          <SimpleLineIcons
            name="arrow-right"
            size={20}
            style={styles.salesListButtonArrow}
          />
        </Pressable>
        <View style={styles.mannerTypeButton}>
          <Text style={styles.mannerTypeButtonText}>받은 매너 평가</Text>
        </View>

        <View style={styles.mannerTypeZone}>
          {reviewData.length === 0 ||
          (reviewData[0] &&
            reviewData[0][Object.keys(reviewData[0])[0]] === 0) ? (
            <Text style={styles.noReviewText}>받은 리뷰가 없어요</Text>
          ) : (
            reviewData.map((reviewItem, index) => (
              <View style={styles.mannerReview} key={index}>
                <Image
                  source={require("../../assets/heartbugi.png")}
                  style={styles.heartbugi}
                />
                <Text style={styles.reviewCount}>
                  {reviewItem[Object.keys(reviewItem)[0]]}
                </Text>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewItemText}>
                    {Object.keys(reviewItem)[0]}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
        <Pressable
          onPress={toMannerReviewList}
          style={styles.mannerReviewButton}
        >
          <Text style={styles.mannerReviewButtonText}>
            받은 거래 후기 ({reviewCount})
          </Text>
          <SimpleLineIcons
            name="arrow-right"
            size={20}
            style={styles.mannerReviewButtonArrow}
          />
        </Pressable>
        {renderPurchaseReviews()}
      </ScrollView>
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
    fontWeight: "600"
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
    marginLeft: vw / 40
  },
  profile: {
    height: vh * 0.13,
    flexDirection: "row",
    paddingHorizontal: 10
  },
  profileImg: {
    flex: 0.75,
    width: "85%",
    height: "85%",
    alignItems: "baseline",
    borderRadius: 100,
    borderWidth: 0.3
  },
  progress: {
    height: 10,
    borderRadius: 30
  },
  trackzone: {
    height: vh * 0.046,
    justifyContent: "center",
    alignItems: "center"
  },
  trackbox: {
    backgroundColor: "#3064e7",
    borderRadius: 20,
    marginVertiacal: vh * 1,
    paddingVertical: vh / 90,
    paddingHorizontal: vw / 20
  },
  mannerStatus: {
    height: vh * 0.08,
    justifyContent: "center",
    paddingHorizontal: vw * 0.028
  },
  mannerText: {
    fontSize: 16,
    textAlign: "left"
  },
  mannerGrade: {
    fontSize: 16,
    marginRight: vw * 0.55,
    color: "#3064e7",
    fontWeight: "500"
  },
  mannerExp: {
    fontSize: 16,
    textAlign: "right",
    marginRight: vw * 0.04,
    color: "#3064e7",
    fontWeight: "500"
  },
  subscriptionZone: {
    height: vh * 0.06,
    paddingVertical: vh * 0.01,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.4,
    borderBottomWidth: 0.4,
    borderColor: "gray"
  },
  dateOfSubscription: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: vw * 0.22
  },
  dateOfSubscriptionData: {
    fontSize: 16,
    color: "gray",
    fontWeight: "500",
    marginLeft: vw * 0.1
  },
  statsZone: {
    height: vh * 0.06,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.4,
    borderColor: "gray"
  },
  statusIndent: {
    marginLeft: vw * 0.03
  },
  statsText: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: vw * 0.015,
    marginRight: vw * 0.1
  },
  salesListButton: {
    height: vh * 0.07,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.4,
    borderBottomColor: "gray"
  },
  salesListButtonText: {
    fontSize: 18,
    marginLeft: vw * 0.03,
    fontWeight: "700"
  },
  salesListButtonArrow: {
    fontWeight: "700",
    marginRight: vw * 0.03
  },
  mannerTypeButton: {
    height: vh * 0.07,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: vw * 0.03
  },
  mannerTypeButtonText: {
    fontSize: 18,
    fontWeight: "700"
  },
  mannerTypeButtonArrow: {
    fontWeight: "700",
    marginRight: vw * 0.03
  },
  mannerTypeZone: {
    height: vh * 0.3,
    justifyContent: "flex-start",
    borderBottomWidth: 0.4,
    borderBottomColor: "gray"
  },
  mannerReview: {
    flexDirection: "row",
    marginHorizontal: vw * 0.02,
    marginVertical: vh * 0.01
  },
  heartbugi: {
    flex: 0.27,
    height: vh * 0.07,
    alignSelf: "flex-start"
  },
  reviewCount: {
    fontSize: 16,
    flex: 0.05,
    alignSelf: "center"
  },
  reviewItem: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: vw * 0.065,
    marginRight: vw * 0.03,
    backgroundColor: "#EFEFEF",
    borderRadius: 17
  },
  reviewItemText: {
    fontSize: 18
  },
  noReviewText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: vh * 0.11
  },
  mannerReviewButton: {
    height: vh * 0.07,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: vw * 0.03
  },
  mannerReviewButtonText: {
    fontSize: 18,
    fontWeight: "700"
  },
  mannerReviewButtonArrow: {
    fontWeight: "700",
    marginRight: vw * 0.03
  },
  purchaseReviews: {
    height: vh * 0.1,
    flexDirection: "row",
    marginHorizontal: vw * 0.03,
    marginTop: vh * 0.025,
    borderBottomWidth: 0.4,
    borderBottomColor: "gray"
  },
  reviewerImageZone: {
    flex: 0.4
  },
  reviewerImage: {
    width: "75%",
    height: "75%",
    borderRadius: 100,
    borderWidth: 0.3
  },
  reviewInfo: {
    flex: 1.3
  },
  reviewWriter: {
    fontSize: 18,
    fontWeight: "500"
  },
  reviewText: {
    marginTop: vh * 0.01,
    fontSize: 16
  }
});

export default MannerInfo;
