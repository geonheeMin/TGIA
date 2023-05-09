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
  TouchableHighlight,
  Animated,
  Dimensions,
  TouchableHighlight
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { ProgressBar } from "react-native-paper";
import BottomTabs from "../../components/BottomTabs";
import useStore from "../../../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

function Profile({ navigation, route }: ProfileScreenProps) {
  const { session, url } = useStore(); // 사용자 아이디
  const [trackFirst, setTrackFirst] = useState(""); // 제 1트랙
  const [trackSecond, setTrackSecond] = useState(""); // 제 2트랙
  const [manner, setManner] = useState(36.5); // 매너온도
  const isFocused = useIsFocused();
  const [aTrackId, setATrackId] = useState(7);
  const [bTrackId, setBTrackId] = useState(9);
  const [profileImg, setProfileImg] = useState();
  const [img, setImg] = useState({});

  useEffect(() => {
    Axios.get(`${url}/profile?userId=` + session.member_id)
      .then((res) => {
        console.log(res.data);
        setTrackFirst(res.data.firstTrack);
        setTrackSecond(res.data.secondTrack);
        setATrackId(res.data.atrackId);
        setBTrackId(res.data.btrackId);
        setProfileImg(res.data.imageFileName);
        console.log(res.data);
      })
      .catch((error) => {
        console.log("프로필 에러");
      });
  }, [isFocused]);

  useEffect(() => {
    Axios.get(`${url}/profile/Img?userId=` + session.member_id)
      .then((res) => {
        setProfileImg(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isFocused]);

  const onSubmit = useCallback(() => {
    Alert.alert("알림", "ㅎㅇ");
  }, []);

  const toTrackSetting = () => {
    navigation.navigate("TrackSetting", { id: [aTrackId, bTrackId] });
  };
  const toSalesHistory = useCallback(() => {
    navigation.navigate("SalesHistory");
  }, [navigation]);
  const toPurchaseHistory = useCallback(() => {
    navigation.navigate("PurchaseHistory");
  }, [navigation]);
  const toFav = useCallback(() => {
    navigation.navigate("Fav");
  }, [navigation]);
  const toChangeProfile = () => {
    navigation.navigate("ChangeProfile", {
      member_id: session.member_id,
      profile_img: profileImg
    });
  };
  const toSettings = useCallback(() => {
    navigation.navigate("Settings");
  }, [navigation]);
  const logout = useCallback(() => {
    AsyncStorage.removeItem("session").then((res) => {
      navigation.reset({ routes: [{ name: "Home" }] });
    });
  }, [navigation]);
  const logoutAlert = () => {
    Alert.alert("로그아웃", "로그아웃 하시겠습니까?", [
      { text: "아니요", style: "cancel" },
      { text: "예", onPress: logout }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View
        style={{
          flex: 0.6,
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingBottom: -50
        }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={{
              uri: `${url}/images/${profileImg}`
            }}
            style={styles.profile}
          />
        </View>
        <View
          style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 16 }}>{session.username}</Text>
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
        style={{ flex: 0.4, justifyContent: "center", paddingHorizontal: 15 }}
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
      <View style={styles.menuZoneTop}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: vh / 80 }}>
          나의 거래
        </Text>
        <View style={{ paddingTop: vh / 100 }}>
          <Pressable style={styles.menuButton} onPress={toSalesHistory}>
            <View style={styles.menuButtonContent}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={28}
                color={"black"}
              />
              <Text style={styles.menuButtonText}>판매내역</Text>
            </View>
          </Pressable>
          <TouchableHighlight
            style={styles.menuButton}
            underlayColor="#F6F6F6"
            onPress={toPurchaseHistory}
          >
            <View style={styles.menuButtonContent}>
              <MaterialCommunityIcons
                name="shopping-outline"
                size={28}
                color={"black"}
              />
              <Text style={styles.menuButtonText}>구매내역</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.menuButton}
            underlayColor="#F6F6F6"
            onPress={toFav}
          >
            <View style={styles.menuButtonContent}>
              <Entypo name="heart-outlined" size={28} color={"black"} />
              <Text style={styles.menuButtonText}>관심목록</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <View style={styles.menuZoneBottom}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: vh / 80 }}>
          기타
        </Text>
        <View style={{ paddingTop: 8 }}>
          <TouchableHighlight
            style={styles.menuButton}
            underlayColor="#F6F6F6"
            onPress={toChangeProfile}
          >
            <View style={styles.menuButtonContent}>
              <Feather name="user" size={28} color={"black"} />
              <Text style={styles.menuButtonText}>프로필 변경</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.menuButton}
            underlayColor="#F6F6F6"
            onPress={toSettings}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="md-settings-outline" size={28} color={"black"} />
              <Text style={styles.menuButtonText}>환경 설정</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.menuButton}
            underlayColor="#F6F6F6"
            onPress={logoutAlert}
          >
            <View style={styles.menuButtonContent}>
              <MaterialIcons name="logout" size={28} color={"#b41b1bba"} />
              <Text
                style={{
                  color: "#b41b1bba",
                  marginLeft: vw / 50,
                  fontSize: 16
                }}
              >
                로그 아웃
              </Text>
            </View>
          </TouchableHighlight>
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
    flex: 0.65,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  trackbox: {
    backgroundColor: "#3064e7",
    borderRadius: 20,
    paddingVertical: vh / 80,
    paddingHorizontal: vw / 20
  },
  menuZoneTop: {
    flex: 1.1,
    justifyContent: "flex-start",
    borderTopWidth: 0.4,
    borderColor: "gray",
    paddingTop: vh / 50,
    paddingHorizontal: vw / 30
  },
  menuZoneBottom: {
    flex: 1.5,
    justifyContent: "flex-start",
    borderTopWidth: 0.4,
    borderColor: "gray",
    paddingTop: vh / 50,
    paddingHorizontal: vw / 30
  },
  menuButton: {
    marginVertical: vh / 75,
    paddingVertical: vh / 190
  },
  menuButtonContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  menuButtonText: {
    marginLeft: vw / 50,
    fontSize: 16
  }
});

export default Profile;
