import React, { useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const { width: vw, height: vh } = Dimensions.get('window');

type PaymentPramList = {
    Payment: undefined,
  }
  type PaymentProps = NativeStackScreenProps<PaymentPramList, "Payment">;

function PaymentCompleted({navigation}: PaymentProps) {
  const toProfile = useCallback(() => {
      navigation.goBack();
  }, [navigation])

  return(
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logoImg}
        />
        <Text style={styles.logoText}>부기마켓</Text>
      </View>
      <Image
        source={require("../../assets/ddabongbugi.png")} 
        style={styles.bugiImg}
      />
      <Text style={styles.text1}>결제가 완료 됐어요</Text>
      <View style={styles.buttonZone}>
        <Text style={styles.text2}>완료 버튼을 눌러 채팅 화면으로 이동하세요</Text>
        <Pressable
          style={styles.completeButton}
          onPress={toProfile}
        >
          <Text style={styles.completeText}>완료</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
  backgroundColor: "white",
  width: vw,
  height: vh,
  },
  topBar: {
    height: vh / 15,
    flexDirection: "row",
    marginTop: vh / 35,
  },
  logoImg: {
    width: vw / 12,
    height: vh / 28,
    marginLeft: vw / 20,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "400",
    marginLeft: vw / 80,
    marginTop: vh / 200,
  },
  bugiImg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: vh / 10,
    marginLeft: vw / 16,
  },
  buttonZone: {
    flex: 1,
  },
  text1: {
    fontSize: 26,
    fontWeight: "500",
    textAlign: "center",
  },
  text2: {
    fontSize: 18,
    color: "#777777",
    textAlign: "center",
    marginTop: vh / 6,
  },
  completeButton: {
    backgroundColor: "#2153d1",
    paddingVertical: vh / 45,
    marginHorizontal: vw / 18,
    borderRadius: 12,
    marginTop: vh / 28,
    alignItems: "center",   
  },
  completeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  }
})

export default PaymentCompleted;