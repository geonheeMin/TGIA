import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
  Animated
} from "react-native";
import { NavigationContainer, ParamListBase } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { ProgressBar } from "react-native-paper";
import { TouchableHighlight } from "react-native-gesture-handler";
import BottomTabs from "../../components/BottomTabs";

interface board {
  id: number;
  title: string;
  user: string;
  category: string;
  content: string;
  date: string;
}

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

function Profile({ navigation, route }: ProfileScreenProps) {
  const [userName, setUserName] = useState("상상부기부기");
  const [trackFirst, setTrackFirst] = useState("웹공학");
  const [trackSecond, setTrackSecond] = useState("모바일소프트웨어");
  const [manner, setManner] = useState("36.5");
  //const id = route.params.id;

  const onSubmit = useCallback(() => {
    Alert.alert("알림", "ㅎㅇ");
  }, []);

  const toTrackSetting = useCallback(() => {
    navigation.navigate("TrackSetting");
  }, [navigation]);
  const toSalesHistory = useCallback(() => {
    navigation.navigate("SalesHistory");
  }, [navigation]);
  const toPurchaseHistory = useCallback(() => {
    navigation.navigate("PurchaseHistory");
  }, [navigation]);
  // const toFav = useCallback(() => {
  //   navigation.navigate('Fav', {id: id});
  // }, [navigation, id]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View
        style={{
          flex: 0.55,
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingBottom: -50
        }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("../../assets/bugi.png")}
            style={styles.profile}
          />
        </View>
        <View
          style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}
        >
          <Text>{userName}</Text>
        </View>
        <View style={{ flex: 2, paddingVertical: 18 }}>
          <View style={styles.trackzone}>
            <TouchableOpacity onPress={toTrackSetting} activeOpacity={0.9}>
              <View style={styles.trackbox}>
                <Text style={{ color: "white" }}>{trackFirst}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.trackzone}>
            <TouchableOpacity onPress={toTrackSetting} activeOpacity={0.9}>
              <View style={styles.trackbox}>
                <Text style={{ color: "white" }}>{trackSecond}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{ flex: 0.35, justifyContent: "center", paddingHorizontal: 15 }}
      >
        <Text style={{ fontSize: 16 }}>매너 온도</Text>
        <View style={{ marginTop: 10, paddingRight: 15 }}>
          <ProgressBar
            progress={manner / 100}
            color={"green"}
            style={styles.progress}
          />
        </View>
      </View>
      <View style={styles.menuZone}>
        <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
          <Text style={{ fontSize: 16 }}>나의 거래</Text>
          <View style={{ paddingTop: 8 }}>
            <TouchableHighlight
              style={styles.menuButton}
              underlayColor="#F6F6F6"
              onPress={toSalesHistory}
            >
              <Text>판매내역</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.menuButton}
              underlayColor="#F6F6F6"
              onPress={toPurchaseHistory}
            >
              <Text>구매내역</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.menuButton}
              underlayColor="#F6F6F6"
              //onPress={toFav}
            >
              <Text>관심목록</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <View style={styles.menuZone}>
        <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
          <Text style={{ fontSize: 16 }}>기타</Text>
          <View style={{ paddingTop: 8 }}>
            <TouchableHighlight
              style={styles.menuButton}
              underlayColor="#F6F6F6"
              onPress={onSubmit}
            >
              <Text>프로필 변경</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.menuButton}
              underlayColor="#F6F6F6"
              onPress={onSubmit}
            >
              <Text>환경 설정</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.menuButton}
              underlayColor="#F6F6F6"
              onPress={onSubmit}
            >
              <Text style={{ color: "#b41b1bba" }}>로그 아웃</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <BottomTabs navigation={navigation} screen="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "white",
    flex: 1
  },
  profile: {
    flex: 0.6,
    width: "75%",
    height: "75%",
    alignItems: "baseline",
    borderRadius: 100,
    borderWidth: 0.3
  },
  progress: {
    height: 10,
    borderRadius: 30
  },
  trackzone: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  trackbox: {
    backgroundColor: "#3064e7",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  menuZone: {
    flex: 1.1,
    justifyContent: "flex-start",
    borderTopWidth: 0.4,
    borderColor: "gray"
  },
  menuButton: {
    marginVertical: 10,
    paddingVertical: 10
  }
});

export default Profile;
