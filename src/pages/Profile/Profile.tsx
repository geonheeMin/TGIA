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
  Dimensions
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
import { useIsFocused } from "@react-navigation/native";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

function Profile({ navigation, route }: ProfileScreenProps) {
  const { session, url } = useStore(); // 사용자 아이디
  const [trackFirst, setTrackFirst] = useState(session?.firstTrack); // 제 1트랙
  const [trackSecond, setTrackSecond] = useState(session?.secondTrack); // 제 2트랙
  const [manner, setManner] = useState(455); // 매너 학점
  const [mannerGrade, setMannerGrade] = useState(""); // 매너 등급
  const isFocused = useIsFocused();
  const [profileImg, setProfileImg] = useState();

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
  }, [manner])

  const onSubmit = useCallback(() => {
    Alert.alert("알림", "ㅎㅇ");
  }, []);

  const toTrackSetting = () => {
    navigation.navigate("TrackSetting", { id: [aTrackId, bTrackId] });
  };
  const toMannerInfo = () => {
    navigation.navigate("MannerInfo", {
      member_Id: session.member_id
    });
  }

  useEffect(() => {    
    setTrackFirst(session?.firstTrack);
    setTrackSecond(session?.secondTrack);
  }, [isFocused]);

  const toTrackSetting = (number: number) => {
    navigation.navigate("TrackSetting", { number: number });
  };

  const toSalesHistory = () => {
    navigation.navigate("SalesHistory", {
      profile_img: profileImg
    });
  };

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
              uri: `${url}/images/${session?.imageFileName}` //이미지 표시 안 되면 수정할 사항 1
            }}
            style={styles.profile}
          />
        </View>
        <View
          style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 16 }}>{session?.username}</Text>
        </View>
        <View style={{ flex: 2, paddingVertical: 18 }}>
          <View style={styles.trackzone}>
            <TouchableOpacity
              onPress={() => toTrackSetting(1)}
              activeOpacity={0.9}
            >
              <View style={styles.trackbox}>
                <Text style={{ color: "white" }}>{trackFirst}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.trackzone}>
            <TouchableOpacity
              onPress={() => toTrackSetting(2)}
              activeOpacity={0.9}
            >
              <View style={styles.trackbox}>
                <Text style={{ color: "white" }}>{trackSecond}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Pressable onPress={toMannerInfo} style={styles.mannerStatus}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.mannerText}>
            매너 학점 
          </Text>
          <Text style={styles.mannerGrade}>
            {mannerGrade}
          </Text>
          <Text style={styles.mannerExp}>
            {manner % 100 + "%"}
          </Text>
        </View>
        <View style={{ marginTop: 10, paddingRight: 15 }}>
          <ProgressBar
            progress={(manner % 100) / 100}
            color={"#3064e7"}
            style={styles.progress}
          />
        </View>
      </Pressable>
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
  mannerStatus: {
    flex: 0.4,
    justifyContent: "center",
    paddingHorizontal: vw / 30,
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
