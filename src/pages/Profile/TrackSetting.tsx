import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { tracks } from "../../assets/data/track";
import { useStore } from "zustand";
// import Creative from "../Tracks/Creative";
// import Art from "../Tracks/Art";
// import SocialScience from "../Tracks/SocialScience";
// import GlobalFashion from "../Tracks/GlobalFashion";
// import ICTDesign from "../Tracks/ICTDesign";
// import BeautyDesign from "../Tracks/BeautyDesign";
// import ComputerEngineering from "../Tracks/ComputerEngineering";
// import Mechanical from "../Tracks/Mechanical";
// import ITConvergence from "../Tracks/ITConvergence";
// import SmartManagement from "../Tracks/SmartManagement";
// import SmartFactory from "../Tracks/SmartFactory";
import { FlatList } from "react-native-gesture-handler";
import { defaultScrollInterpolator } from "../../utils/animations";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type TrackSettingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TrackSetting"
>;

function TrackSetting({ navigation, route }: TrackSettingScreenProps) {
  const [collegeMenu, setCollegeMenu] = useState("");
  const [departmentMenu, setDepartmentMenu] = useState("");
  const [trackMenu, setTrackMenu] = useState("");
  const aTrackId = route.params?.id[0]; // atrack 파라미터
  const bTrackId = route.params?.id[1]; // btrack 파라미터
  const collegeList = [...new Set(tracks.map((item) => item.college))];

  const renderTrack = (depart) => {
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
              <View style={styles.collegeZone}>
                <Text style={styles.collegeName}>{item.item}</Text>
              </View>
              <View style={styles.separator} />
            </Pressable>
          );
        }}
      />
    );
  };

  const renderDepart = (college) => {
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
              <View style={styles.collegeZone}>
                <Text style={styles.collegeName}>{item.item}</Text>
                {departmentMenu === item.item ? renderTrack(item.item) : null}
              </View>
              <View style={styles.separator} />
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
                {collegeMenu === item.item ? renderDepart(item.item) : null}
              </View>
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

  useEffect(() => console.log(collegeList), []);

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
        <Text style={{ fontSize: 18, fontWeight: "600", paddingLeft: vw / 40 }}>
          트랙 설정
        </Text>
      </View>
      <View style={styles.menuZone}>
        <FlatList
          data={collegeList}
          renderItem={(item) => renderCollege(item)}
        />
      </View>
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
  menuZone: {
    flex: 1.1,
    borderTopWidth: 0.2,
    marginBottom: 15,
    borderColor: "gray"
  },
  collegeZone: {
    backgroundColor: "#3064e7",
    paddingVertical: 15
  },
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
    marginLeft: 10
  },
  departName: {
    fontSize: 15
  },
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
