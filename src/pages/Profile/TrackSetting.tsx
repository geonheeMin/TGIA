import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { tracks } from "../../assets/data/track";
import useStore from "../../../store";
import IonIcon from "react-native-vector-icons/Ionicons";
import { FlatList } from "react-native-gesture-handler";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type TrackSettingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TrackSetting"
>;

function TrackSetting({ navigation, route }: TrackSettingScreenProps) {
  const { session, setSession, url } = useStore();
  const [collegeMenu, setCollegeMenu] = useState("");
  const [departmentMenu, setDepartmentMenu] = useState("");
  const [trackMenu, setTrackMenu] = useState("");
  const params = route.params;
  const whichTrack = params?.number;
  const collegeList = [...new Set(tracks.map((item) => item.college))];

  const alertError = (number) => {
    Alert.alert(`트랙 변경 실패 ${number}`, "잠시 후 다시 시도하십시오"),
      [{ text: "확인", style: "cancel" }];
  };

  const sendTrack = () => {
    if (trackMenu === session?.firstTrack) {
      Alert.alert("입력 오류", `${trackMenu}는 현재 1트랙입니다.`, [
        {
          text: "확인",
          style: "cancel"
        }
      ]);
    } else if (trackMenu === session?.secondTrack) {
      Alert.alert("입력 오류", `${trackMenu}는 현재 2트랙입니다.`, [
        {
          text: "확인",
          style: "cancel"
        }
      ]);
    } else {
      const trackUpdateDto = {
        userId: session?.member_id,
        trackNumber: whichTrack,
        trackId: whichTrack === 1 ? session?.atrackId : session?.btrackId,
        trackname: trackMenu
      };
      Axios.post(`${url}/profile/list/`, trackUpdateDto)
        .then((res) => {
          const profileListDto = {
            member_id: session?.member_id,
            first_department:
              whichTrack === 1 ? departmentMenu : session?.first_department,
            second_department:
              whichTrack === 1 ? session?.second_department : departmentMenu
          };
          Axios.post(`${url}/profile/add_college`, profileListDto).then(
            (res) => {
              AsyncStorage.removeItem("session")
                .then(() => {
                  AsyncStorage.setItem("session", JSON.stringify(res.data))
                    .then(() => {
                      AsyncStorage.getItem("session")
                        .then((value) => {
                          setSession(JSON.parse(value));
                          Alert.alert(
                            "트랙 변경 성공",
                            "트랙을 변경하였습니다",
                            [
                              {
                                text: "확인",
                                onPress: () => navigation.goBack()
                              }
                            ]
                          );
                        })
                        .catch((err) => alertError(1));
                    })
                    .catch((err) => alertError(2));
                })
                .catch((err) => alertError(3));
            }
          );
        })
        .catch((err) => {
          alertError(4);
          console.log(err);
          console.log(trackUpdateDto);
        });
    }
  };

  const adjustPressed = () => {
    Alert.alert(
      "트랙 변경",
      `${whichTrack}트랙을 ${trackMenu}으로 변경하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { text: "변경", onPress: () => sendTrack() }
      ]
    );
  };

  const renderTrack = (depart: string) => {
    const trackList = [
      ...new Set(
        tracks
          .filter((item) => item.department === depart)
          .map((item) => item.track)
      )
    ];

    return (
      <FlatList
        data={trackList}
        renderItem={(item) => {
          return (
            <Pressable
              onPress={() =>
                trackMenu === item.item
                  ? setTrackMenu("")
                  : setTrackMenu(item.item)
              }
            >
              <View style={{ backgroundColor: "lightgrey", height: 1 }} />
              <View
                style={[
                  styles.trackZone,
                  {
                    backgroundColor:
                      trackMenu === item.item ? "#E9E9E9" : "white"
                  }
                ]}
              >
                <Text style={styles.trackName}>{item.item}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    );
  };

  const renderDepart = (college: string) => {
    const departmentList = [
      ...new Set(
        tracks
          .filter((item) => item.college === college)
          .map((item) => item.department)
      )
    ];
    return (
      <FlatList
        data={departmentList}
        renderItem={(item) => {
          return (
            <Pressable
              onPress={() =>
                departmentMenu === item.item
                  ? setDepartmentMenu("")
                  : setDepartmentMenu(item.item)
              }
            >
              <View style={styles.separator} />
              <View style={styles.departZone}>
                <Text style={styles.departName}>{item.item}</Text>
              </View>
              {departmentMenu === item.item ? renderTrack(item.item) : null}
            </Pressable>
          );
        }}
      />
    );
  };

  const renderCollege = () => {
    return (
      <FlatList
        data={collegeList}
        renderItem={(item) => {
          return (
            <Pressable
              onPress={() =>
                collegeMenu === item.item
                  ? setCollegeMenu("")
                  : setCollegeMenu(item.item)
              }
            >
              <View style={styles.collegeZone}>
                <Text style={styles.collegeName}> {item.item} </Text>
              </View>

              {collegeMenu === item.item ? renderDepart(item.item) : null}
              <View style={styles.separator} />
            </Pressable>
          );
        }}
      />
    );
  };

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
          <View style={{ flexDirection: "row" }}>
            <IonIcon name={"chevron-back-sharp"} size={25} />
            <Text
              style={{
                alignSelf: "center",
                fontSize: 18,
                fontWeight: "600",
                paddingLeft: vw / 40
              }}
            >
              트랙 설정
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => adjustPressed()}
          style={{ position: "absolute", right: 15 }}
        >
          <Text
            style={{
              color: trackMenu === "" ? "grey" : "#3064e7",
              fontSize: 20,
              fontWeight: "bold"
            }}
          >
            등록
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuZone}>{renderCollege()}</View>
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
    paddingLeft: vw / 50,
    height: vh / 17.5
  },
  menuZone: {
    flex: 1.1,
    borderTopWidth: 0.2,
    marginBottom: 15,
    borderColor: "gray"
  },
  collegeZone: {
    backgroundColor: "#3064e7",
    paddingVertical: 20
  },
  departZone: { backgroundColor: "#5496ff", paddingVertical: 20 },
  trackZone: { paddingVertical: 20 },

  menuButton: {
    marginVertical: 10,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderColor: "gray"
  },
  menuButtonOn: {
    marginVertical: 10,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderColor: "#2153d1"
  },
  menuButtonOff: {
    marginVertical: 10,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderColor: "gray"
  },
  collegeName: {
    fontSize: 18,
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    letterSpacing: 1
  },
  departName: {
    fontSize: 15,
    marginLeft: 15,
    color: "white",
    fontWeight: "600"
  },
  trackName: { fontSize: 13.5, marginLeft: 20 },

  departOn: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2153d1"
  },
  departOff: {
    fontSize: 15,
    color: "black"
  },
  separator: {
    width: vw,
    height: 1,
    backgroundColor: "white"
  }
});

export default TrackSetting;
