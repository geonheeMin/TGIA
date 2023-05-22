import * as React from "react";
import { useCallback, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  ActivityIndicator
} from "react-native";
import useStore from "../../../store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import SendIntentAndroid from "react-native-send-intent";
import Axios from "axios";

const { width: vw, height: vh } = Dimensions.get("window");

type PaymentPramList = {
  Payment: undefined;
};
type PaymentProps = NativeStackScreenProps<PaymentPramList, "Payment">;

function PaymentScreen({ route, navigation }: PaymentProps) {
  const post = route.params?.post;
  const { session, url } = useStore();
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymentEnded, setPaymentEnded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>();
  const kakaoPayDto = {
    post_id: post.post_id,
    user_id: post.member_id,
    buyer_id: session?.member_id,
    price: post.price,
    item_name: post.title
  };

  const toProfile = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const tryPayment = () => {
    Axios.post(`${url}/payment/ready`, kakaoPayDto)
      .then((res) => {
        console.log(res.data);
        setPaymentVisible(true);
        setPaymentUrl(res.data.next_redirect_app_url);
      })
      .catch((err) => console.log(err));
  };

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    console.log(url);
    if (url.includes("payment/success")) {
      setPaymentVisible(false);
      setPaymentSuccess(true);
      setPaymentEnded(true);
      setPaymentUrl("");
    } else if (url.includes("payment/fail")) {
      setPaymentVisible(false);
      setPaymentSuccess(false);
      setPaymentEnded(true);
      setPaymentUrl("");
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {paymentVisible ? (
        Platform.OS === "ios" ? (
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            style={{ position: "absolute", width: vw, height: vh }}
          />
        ) : (
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            onShouldStartLoadWithRequest={(e) => {
              if (e.url.startsWith("intent")) {
                SendIntentAndroid.openAppWithUri(e.url);
                return false;
              }
              return true;
            }}
            originWhitelist={["*"]}
            style={{ position: "absolute", width: vw, height: vh }}
          />
        )
      ) : null}
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
      {!paymentEnded ? (
        <View>
          <Text style={styles.text1}>결제하시겠습니까?</Text>
          <View style={styles.buttonZone}>
            <Text style={styles.text2}>
              결제하기 버튼을 통해 카카오페이 간편결제를 실행합니다
            </Text>
            <Pressable style={styles.completeButton} onPress={tryPayment}>
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
            <Pressable style={styles.completeButton} onPress={toProfile}>
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
