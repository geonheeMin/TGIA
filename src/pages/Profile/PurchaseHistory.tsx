import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Alert,
  TouchableOpacity
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

type PurchaseHistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PurchaseHistory"
>;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function PurchaseHistory({ navigation }: PurchaseHistoryScreenProps) {
  const onSubmit = useCallback(() => {
    Alert.alert("알림", "ㅎㅇ");
  }, []);

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={toProfile}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/design/backIcon.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 18, fontWeight: "500", paddingLeft: vw / 3.1 }}
        >
          구매내역
        </Text>
      </View>
      <ScrollView>
        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/diptyque.jpg")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 3세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn} onPress={onSubmit}>
          <Text style={styles.reviewText}>거래후기 남기기</Text>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/bugi.png")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 4세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn} onPress={onSubmit}>
          <Text style={styles.reviewText}>거래후기 남기기</Text>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/bugi.png")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 5세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn} onPress={onSubmit}>
          <Text style={styles.reviewText}>거래후기 남기기</Text>
        </Pressable>
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
  backButton: {
    width: vw / 22,
    height: vh / 36
  },
  backButtonImg: {
    width: vw / 12,
    height: vh / 28,
    marginLeft: vw / 50
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
  },
  compliteButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: "auto",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 20
  },
  items: {
    paddingBottom: 5,
    backgroundColor: "white",
    flexDirection: "row"
  },
  itemImageZone: {
    flex: 1,
    paddingVertical: 15
  },
  itemInfo: {
    flex: 2
  },
  itemImage: {
    flex: 1,
    width: "85%",
    height: "85%",
    paddingVertical: "39%",
    marginLeft: 18,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 0.3
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 20,
    marginLeft: 16
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 10,
    marginLeft: 16
  },
  reviewBtn: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#EEEEEE"
  },
  reviewText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3064e7",
    textAlign: "center"
  }
});

export default PurchaseHistory;
