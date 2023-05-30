import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useStore from "../../../store";
import Axios from "axios";

const { width: vw, height: vh } = Dimensions.get('window');

type MannerReviewPramList = {
  MannerInfo: undefined,
}
type MannerReviewProps = NativeStackScreenProps<MannerReviewPramList, "MannerReview">;

function MannerReview({navigation, route}: MannerReviewProps) {
  const { session, url } = useStore();
  const [buyerName, setBuyerName] = useState(session.username);
  const [sellerName, setSellerName] = useState(route.params.seller_name);
  const [buyerId, setBuyerId] = useState(session.member_id);
  const [sellerId, setSellerId] = useState(route.params.seller_Id);
  const [postId, setPostId] = useState(route.params.post_Id);
  const [currentIndex, setCurrentIndex] = useState(4);
  const [score, setScore] = useState(10);
  const data = [
    "F",
    "D",
    "C0",
    "C+",
    "B0",
    "B+",
    "A0",
    "A+",
  ];
  const [newIndex, setNewIndex] = useState(4);
  const [goodPrice, setGoodPrice] = useState(false);
  const [goodTime, setGoodTime] = useState(false);
  const [fastResponse, setFastResponse] = useState(false);
  const [badQuality, setBadQuality] = useState(false);
  const [noResponse, setNoResponse] = useState(false);
  const [text, setText] = useState("");
  const [reDealing, setReDealing] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation])

  const handleButtonPress = (direction) => {
    if (direction === "prev") {
      setNewIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1));
    } else if (direction === "next") {
      setNewIndex((prevIndex) => (prevIndex + 1) % data.length);
    }

    setCurrentIndex(newIndex);

    switch (data[newIndex]) {
      case "F":
        setScore(-15);
        setReDealing(false);
        break;
      case "D":
        setScore(-5);
        setReDealing(false);
        break;
      case "C0":
        setScore(5);
        setReDealing(false);
        break;
      case "C+":
        setScore(10);
        setReDealing(false);
        break;
      case "B0":
        setScore(15);
        setReDealing(false);
        break;
      case "B+":
        setScore(20);
        setReDealing(true);
        break;
      case "A0":
        setScore(25);
        setReDealing(true);
        break;
      case "A+":
        setScore(30);
        setReDealing(true);
        break;
      default:
        setScore(0);
        setReDealing(false);
        break;
    }
  };

  function submitButton() {
    Alert.alert("후기 전송", "매너 평가를 완료하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "등록", onPress: submitReview }
    ]);
  }

  function submitReview() {
    const request = {
      buyerId: session.member_id, 
      sellerId: sellerId,
      post_id: postId,
      mannerScore: score,
      goodPrice: goodPrice,
      goodTime: goodTime,
      fastResponse: fastResponse,
      badQuality: badQuality,
      noResponse: noResponse,
      reDealing: reDealing,
    }
  
    const purchaseReviewDTO = {
      buyer_id: session.member_id,
      seller_id: sellerId,
      review: text,
      post_id: postId,
    }

    Axios.post(`${url}/manner/set_score`, request)
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.log("set errer" + error)
    })

    Axios.post(`${url}/add_purchase_review`, purchaseReviewDTO)
    .then((res) => {
      console.log(res)
      goBack()
    })
    .catch((error) => {
      console.log("review error" + error)
    })
  }
  
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
          거래 후기 보내기
        </Text>
      </View>
      <View style={styles.messageZone}>
        <View style={{flex: 1}}>
          <Text style={styles.questionText}></Text>
          <Text style={styles.questionText}>{sellerName}님과 거래가 어떠셨나요?</Text>
          <Text style={styles.tipText}>거래 선호도는 나만 볼 수 있어요.</Text>
        </View>
        <Image
          source={require("../../assets/heartbugi.png")}
          style={styles.heartbugi}
        />
      </View>
      <View style={styles.gradeZone}>
        <Pressable
          onPress={() => handleButtonPress("prev")}
          style={styles.gradeControlButton}
        >
          <Text style={styles.gradeControlText}>
            {"<"}
          </Text>
        </Pressable>
        <View style={styles.gradeTextSpace}>
          <Text style={styles.gradeText}>
            {data[(newIndex)]}
          </Text>
        </View>
        <Pressable
          onPress={() => handleButtonPress("next")}
          style={styles.gradeControlButton}
        >
          <Text style={styles.gradeControlText}>
            {">"}
          </Text>
        </Pressable>
      </View>
    
      <View style={styles.reviewZone}>
        {goodPrice ? (
          <Pressable
            onPress={() => {
              setGoodPrice(!goodPrice);
              setAnnouncement(announcement - 1);
            }}
            style={[styles.reviewItem, { backgroundColor: "#3064e7" }]}
          >
            <Text style={styles.reviewTextTrue}>좋은 상품을 저렴하게 판매해요</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setGoodPrice(!goodPrice);
              setAnnouncement(announcement + 1);
            }}
            style={styles.reviewItem}
          >
            <Text style={styles.reviewTextFalse}>좋은 상품을 저렴하게 판매해요</Text>
          </Pressable>
        )}
        {goodTime ? (
          <Pressable
            onPress={() => {
              setGoodTime(!goodTime);
              setAnnouncement(announcement - 1);
            }}
            style={[styles.reviewItem, { backgroundColor: "#3064e7" }]}
          >
            <Text style={styles.reviewTextTrue}>시간 약속을 잘 지켜요</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setGoodTime(!goodTime);
              setAnnouncement(announcement + 1);
            }}
            style={styles.reviewItem}
          >
            <Text style={styles.reviewTextFalse}>시간 약속을 잘 지켜요</Text>
          </Pressable>
        )}
        {fastResponse ? (
          <Pressable
            onPress={() => {
              setFastResponse(!fastResponse);
              setAnnouncement(announcement - 1);
            }}
            style={[styles.reviewItem, { backgroundColor: "#3064e7" }]}
          >
            <Text style={styles.reviewTextTrue}>응답 속도가 빨라요</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setFastResponse(!fastResponse);
              setAnnouncement(announcement + 1);
            }}
            style={styles.reviewItem}
          >
            <Text style={styles.reviewTextFalse}>응답 속도가 빨라요</Text>
          </Pressable>
        )}
        {badQuality ? (
          <Pressable
            onPress={() => {
              setBadQuality(!badQuality);
              setAnnouncement(announcement + 1);
            }}
            style={[styles.reviewItem, { backgroundColor: "#d70b0ba2" }]}
          >
            <Text style={styles.reviewTextTrue}>상품에 하자가 있어요</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setBadQuality(!badQuality);
              setAnnouncement(announcement - 1);
            }}
            style={styles.reviewItem}
          >
            <Text style={styles.reviewTextFalse}>상품에 하자가 있어요</Text>
          </Pressable>
        )}
        {noResponse ? (
          <Pressable
            onPress={() => {
              setNoResponse(!noResponse);
              setAnnouncement(announcement + 1);
            }}
            style={[styles.reviewItem, { backgroundColor: "#d70b0ba2" }]}
          >
            <Text style={styles.reviewTextTrue}>연락이 잘 안 돼요</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setNoResponse(!noResponse);
              setAnnouncement(announcement - 1);
            }}
            style={styles.reviewItem}
          >
            <Text style={styles.reviewTextFalse}>연락이 잘 안 돼요</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.guideZone}>
        {announcement === 0 ?
          <Text style={styles.guideTextA}>
            {sellerName}님에게 거래 후기를 남겨보세요.
          </Text>
          : announcement > 0 ?
            <Text style={styles.guideTextA}>
              {sellerName}님에게 감사 인사를 남겨보세요.
            </Text>
            : 
            <Text style={styles.guideTextA}>
              {sellerName}님에게 아쉬웠던 점을 남겨보세요.
            </Text>
        }
        <Text style={styles.guideTextB}>
          작성한 내용은 상대방 프로필에 공개됩니다.
        </Text>
      </View>
      <View style={styles.textBar}>
        <TextInput
          multiline={true}
          style={styles.textInput}
          placeholder={"내용을 입력해주세요"}
          placeholderTextColor={"lightgrey"}
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
        />
      </View>
      <Pressable
        onPress={submitButton}
        style={styles.submitButton}
      >
        <Text style={styles.submitButtonText}>
          전송
        </Text>
      </Pressable>
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
    marginLeft: vw / 4,
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
  questionText: {
    fontSize: 18,
  },
  tipText: {
    color: "gray",
    marginTop: vh * 0.01,
  },
  heartbugi: {
    flex: 0.3,
    height: vh / 7,
  },
  gradeZone: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gradeControlButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: vw * 0.05,
    paddingVertical: vh * 0.015,
  },
  gradeControlText: {
    fontSize: 80,
  },
  gradeTextSpace: {
    flex: 1,
    alignItems: "center"
  },
  gradeText: {
    fontSize: 90,
    color: "#3064e7",
    fontWeight: "700",
  },
  reviewZone: {
    flex : 1,
    lignItems: "center",
    justifyContent: "center",
    marginHorizontal: vw * 0.05,
  },
  reviewItem: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: vh * 0.009,
    backgroundColor: "#DDDDDD",
    borderRadius: 60,  
  },
  reviewTextFalse: {
    fontSize: 16,
  },
  reviewTextTrue: {
    fontSize: 16,
    color: "white"
  },
  guideZone: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  guideTextA: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  guideTextB: {
    fontSize: 16,
    color: "gray"
  },
  textBar: {
    height: vh * 0.15,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#EDEDED",
    paddingVertical: vh * 0.01,
    marginHorizontal: vw * 0.05,
  },
  textInput: {
    justifyContent: "center",
    alignSelf: "flex-start",
    width: vw - vw / 12.5,
    height: vh * 0.02,
    textAlignVertical: "top",
    color: "black"
  },
  submitButton: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: vh * 0.015,
    marginHorizontal: vw * 0.33,
    backgroundColor: "#1440af",
    borderRadius: 20,
  },
  submitButtonText: {
    fontSize: 16,
    color: "white",
  },
})

export default MannerReview;