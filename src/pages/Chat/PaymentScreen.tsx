import * as React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import useStore from "../../../store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Axios from "axios";
import { ChatApis } from "./ChatApis";

const { width: vw, height: vh } = Dimensions.get("window");

type PaymentPramList = {
  Payment: undefined;
};
type PaymentProps = NativeStackScreenProps<PaymentPramList, "Payment">;

function PaymentScreen({ route, navigation }: PaymentProps) {
  const post = route.params?.post;
  const chatroom = route.params?.chatroom;
  const { session, url, paymentSuccess, setPaymentSuccess } = useStore();

  const kakaoPayDto = {
    post_id: post.post_id,
    user_id: post.member_id,
    buyer_id: session?.member_id,
    price: post.price,
    item_name: post.title
  };

  const toChat = () => {
    if (paymentSuccess) {
      const SendMessageRequestDTO = {
        chatroom_id: chatroom.chatroom_id,
        sender_id: session?.member_id,
        message: ChatApis[1].api
      };
      Axios.post(`${url}/chat/send_V2`, SendMessageRequestDTO, {
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => {
          setPaymentSuccess(null);
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const tryPayment = () => {
    Axios.post(`${url}/payment/ready`, kakaoPayDto)
      .then((res) => {
        navigation.navigate("TryPayment", {
          url: res.data.next_redirect_app_url
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logoImg}
        />
        <Text style={styles.logoText}>부기마켓</Text>
      </View>
      <View
        style={{ justifyContent: "center", alignItems: "center", width: vw }}
      >
        <Image
          source={require("../../assets/ddabongbugi.png")}
          style={styles.bugiImg}
          resizeMode={"contain"}
        />
      </View>
      {!paymentSuccess || paymentSuccess === null ? (
        <View>
          <Text style={styles.text1}>결제하시겠습니까?</Text>
          <View style={styles.buttonZone}>
            <Text style={styles.text2}>
              결제하기 버튼을 통해 카카오페이 간편결제를 실행합니다
            </Text>
            <Pressable
              style={styles.completeButton}
              onPress={() => tryPayment()}
            >
              <Text style={styles.completeText}>결제하기</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.text1}>
            {paymentSuccess ? "결제가 완료됐어요" : "결제가 실패했어요"}
          </Text>
          <View style={styles.buttonZone}>
            <Text style={styles.text2}>
              완료 버튼을 눌러 채팅 화면으로 이동하세요
            </Text>
            <Pressable style={styles.completeButton} onPress={() => toChat()}>
              <Text style={styles.completeText}>완료</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "white",
    width: vw,
    height: vh
  },
  topBar: {
    height: vh / 15,
    flexDirection: "row",
    marginTop: vh / 35
  },
  logoImg: {
    width: vw / 12,
    height: vh / 28,
    marginLeft: vw / 20
  },
  logoText: {
    fontSize: 18,
    fontWeight: "400",
    marginLeft: vw / 80,
    marginTop: vh / 200
  },
  bugiImg: {
    width: "50%",
    height: "50%",
    justifyContent: "center",
    marginHorizontal: "auto"
  },
  buttonZone: {
    flex: 1
  },
  text1: {
    fontSize: 26,
    fontWeight: "500",
    textAlign: "center"
  },
  text2: {
    fontSize: 18,
    color: "#777777",
    textAlign: "center",
    marginTop: vh / 6
  },
  completeButton: {
    backgroundColor: "#2153d1",
    paddingVertical: vh / 45,
    marginHorizontal: vw / 18,
    borderRadius: 12,
    marginTop: vh / 28,
    alignItems: "center",
    height: 60
  },
  completeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500"
  }
});

export default PaymentScreen;
