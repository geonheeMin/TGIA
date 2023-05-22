import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Image,
  ScrollView
} from "react-native";
import { ChatApis } from "../Chat/ChatApis";
import useStore from "../../../store";
import Axios from "axios";
import requestPayment from "../../assets/design/api/requestPay.png";
import reservation from "../../assets/design/api/reservation.png";
import sendLocation from "../../assets/design/api/myLocation.png";

const { width: vw, height: vh } = Dimensions.get("window");

const TestScreen = () => {
  return (
    <ScrollView style={{ width: vw, height: vh }}>
      <View style={styles.myApiBoxBack}>
        <View style={styles.myApiBoxTop} />
        <View style={styles.myApiBoxBottom}>
          <Image
            source={ChatApis[0].img}
            style={{
              width: vw / 3,
              height: vw / 3,
              position: "absolute",
              top: -60,
              right: -20
            }}
          />
          <Text>송금을 요청하였습니다.</Text>
        </View>
      </View>
      <View style={styles.otherApiBoxBack}>
        <View style={styles.otherApiBoxTop} />
        <View style={styles.otherApiBoxBottom}>
          <Image
            source={ChatApis[2].img}
            style={{
              width: vw / 3,
              height: vw / 3,
              position: "absolute",
              top: -60,
              right: 0
            }}
          />
          <Text>거래를 예약하였습니다.</Text>
        </View>
      </View>
      <View style={styles.myApiBoxBack}>
        <View style={styles.myApiBoxTop} />
        <View style={styles.myApiBoxBottom}>
          <Image
            source={ChatApis[3].img}
            style={{
              width: vw / 3,
              height: vw / 3,
              position: "absolute",
              top: -60,
              right: -20
            }}
          />
          <Text>송금을 요청하였습니다.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  myApiBoxBack: {
    borderRadius: 10,
    alignSelf: "flex-end",
    Width: vw / 1.6,
    height: vh / 4,
    marginRight: 5,
    marginTop: 100,
    borderWidth: 0.5,
    borderColor: "lightgrey"
  },
  myApiBoxTop: {
    backgroundColor: "#0b60fe",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    paddingLeft: 10,
    flex: 0.35,
    width: vw / 1.6
  },
  myApiBoxBottom: {
    backgroundColor: "white",
    flex: 0.65,
    width: vw / 1.6,

    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  otherApiBoxBack: {
    borderRadius: 10,
    alignSelf: "flex-start",
    Width: vw / 1.6,
    height: vh / 4,
    marginLeft: 5,
    marginTop: 100,
    borderWidth: 0.5,
    borderColor: "lightgrey"
  },
  otherApiBoxTop: {
    backgroundColor: "#0b60fe",
    width: vw / 1.6,
    flex: 0.35,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  otherApiBoxBottom: {
    backgroundColor: "white",
    width: vw / 1.6,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flex: 0.65
  }
});

export default TestScreen;
