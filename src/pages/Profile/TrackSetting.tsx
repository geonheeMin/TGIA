import React, { useState, useCallback } from "react";
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
import Creative from "../Tracks/Creative";
import Art from "../Tracks/Art";
import SocialScience from "../Tracks/SocialScience";
import GlobalFashion from "../Tracks/GlobalFashion";
import ICTDesign from "../Tracks/ICTDesign";
import BeautyDesign from "../Tracks/BeautyDesign";
import ComputerEngineering from "../Tracks/ComputerEngineering";
import Mechanical from "../Tracks/Mechanical";
import ITConvergence from "../Tracks/ITConvergence";
import SmartManagement from "../Tracks/SmartManagement";
import SmartFactory from "../Tracks/SmartFactory";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type TrackSettingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TrackSetting"
>;

function TrackSetting({ navigation, route }: TrackSettingScreenProps) {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [visible6, setVisible6] = useState(false);
  const [visible7, setVisible7] = useState(false);
  const [visible8, setVisible8] = useState(false);
  const [visible9, setVisible9] = useState(false);
  const [visible10, setVisible10] = useState(false);
  const [visible11, setVisible11] = useState(false);
  const aTrackId = route.params.id[0]; // atrack 파라미터
  const bTrackId = route.params.id[1]; // btrack 파라미터

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
        <Text style={{ fontSize: 18, fontWeight: "600",  paddingLeft: vw / 40 }}>
          트랙 설정
        </Text>
      </View>
      <ScrollView>
        <View style={styles.menuZone}>
          <View style={styles.collegeZone}>
            <Text style={styles.collegeName}>크리에이티브인문예술대학</Text>
          </View>
          <TouchableOpacity
            style={visible === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible(!visible)}
          >
            <Text
              style={visible === true ? styles.departOn : styles.departOff}
            >
              크리에이티브 인문학부
            </Text>
          </TouchableOpacity>
          {visible && <Creative navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
          <TouchableOpacity
            style={visible2 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible2(!visible2)}
          >
            <Text
              style={visible2 === true ? styles.departOn : styles.departOff}
            >
              예술학부
            </Text>
          </TouchableOpacity>
          {visible2 && <Art navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
        </View>
        <View style={styles.menuZone}>
          <View style={styles.collegeZone}>
            <Text style={styles.collegeName}>미래융합사회과학대학</Text>
          </View>
          <TouchableOpacity
            style={visible3 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible3(!visible3)}
          >
            <Text
              style={visible3 === true ? styles.departOn : styles.departOff}
            >
              사회과학부
            </Text>
          </TouchableOpacity>
          {visible3 && <SocialScience navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
        </View>
        <View style={styles.menuZone}>
          <View style={styles.collegeZone}>
            <Text style={styles.collegeName}>디자인대학</Text>
          </View>
          <TouchableOpacity
            style={visible4 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible4(!visible4)}
          >
            <Text
              style={visible4 === true ? styles.departOn : styles.departOff}
            >
              글로벌패션산업학부
            </Text>
          </TouchableOpacity>
          {visible4 && <GlobalFashion navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
          <TouchableOpacity
            style={visible5 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible5(!visible5)}
          >
            <Text
              style={visible5 === true ? styles.departOn : styles.departOff}
            >
              ICT디자인학부
            </Text>
          </TouchableOpacity>
          {visible5 && <ICTDesign navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
          <TouchableOpacity
            style={visible6 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible6(!visible6)}
          >
            <Text
              style={visible6 === true ? styles.departOn : styles.departOff}
            >
              뷰티디자인매니지먼트학과
            </Text>
          </TouchableOpacity>
          {visible6 && <BeautyDesign navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
        </View>
        <View style={styles.menuZone}>
          <View style={styles.collegeZone}>
            <Text style={styles.collegeName}>IT공과대학</Text>
          </View>
          <TouchableOpacity
            style={visible7 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible7(!visible7)}
          >
            <Text
              style={visible7 === true ? styles.departOn : styles.departOff}
            >
              컴퓨터공학부
            </Text>
          </TouchableOpacity>
          {visible7 && <ComputerEngineering navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
          <TouchableOpacity
            style={visible8 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible8(!visible8)}
          >
            <Text
              style={visible8 === true ? styles.departOn : styles.departOff}
            >
              기계전자공학부
            </Text>
          </TouchableOpacity>
          {visible8 && <Mechanical navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
          <TouchableOpacity
            style={visible9 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible9(!visible9)}
          >
            <Text
              style={visible9 === true ? styles.departOn : styles.departOff}
            >
              IT융합공학부
            </Text>
          </TouchableOpacity>
          {visible9 && <ITConvergence navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
          <TouchableOpacity
            style={visible10 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible10(!visible10)}
          >
            <Text
              style={visible10 === true ? styles.departOn : styles.departOff}
            >
              스마트경영공학부
            </Text>
          </TouchableOpacity>
          {visible10 && <SmartManagement navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
          <TouchableOpacity
            style={visible11 === true? styles.menuButtonOn : styles.menuButtonOff}
            activeOpacity={0.7}
            onPress={() => setVisible11(!visible11)}
          >
            <Text
              style={visible11 === true ? styles.departOn : styles.departOff}
            >
              스마트팩토리컨설팅학과
            </Text>
          </TouchableOpacity>
          {visible11 && <SmartFactory navigation={navigation} aTrack={aTrackId} bTrack={bTrackId}/>}
        </View>
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
    borderColor: "#2153d1",
  },
  menuButtonOff: {
    marginVertical: 10,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderColor: "gray",
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
    color: "#2153d1",
  },
  departOff: {
    fontSize: 15,
  },
});

export default TrackSetting;
