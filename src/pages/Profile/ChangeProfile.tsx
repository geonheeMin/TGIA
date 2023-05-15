import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  Image,
  TouchableHighlight,
  TextInput,
  TouchableOpacity
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { launchImageLibrary } from "react-native-image-picker";
import useStore from "../../../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import IonIcon from "react-native-vector-icons/Ionicons";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type ChangeProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ChangeProfile"
>;

function ChangeProfile({ navigation, route }: ChangeProfileScreenProps) {
  const { session, setSession, url } = useStore();
  const [nickname, setNickname] = useState(session.username);
  const [profileImg, setProfileImg] = useState(route.params.profile_img);
  const [selectedImg, setSelectedImg] = useState(324);
  const [img, setImg] = useState({});

  const toProfile = () => {
    navigation.reset({ routes: [{ name: "Profile" }] });
  };

  /** 갤러리에서 이미지 선택하는 함수 */
  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res.didCancel) {
        console.log("Canceled");
      } else if (res.errorCode) {
        console.log("Errored");
      } else {
        const formData = new FormData();
        formData.append("image", {
          uri: res.assets[0].uri,
          type: "image/jpg",
          name: res.assets[0].fileName
        });
        Axios.post(`${url}/image/send_image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
          .then((res) => {
            console.log(res.data + "성공");
            setSelectedImg(res.data);
            //setFilename(res.data);
          })
          .catch((error) => console.log(error));
        setImg(res.assets[0]);
      }
    });
  };

  const confirm = () => {
    const request = {
      member_id: route.params.member_id, // 유저 아이디
      username: nickname, // 변경할 유저 닉네임
      image_filename: selectedImg // 선택한 이미지
    };

    Axios.post(`${url}/profile/change`, request)
      .then((res) => {
        console.log(res.data);
        console.log("변경됨");
        AsyncStorage.removeItem("session")
          .then(() => {
            console.log("1");
            AsyncStorage.setItem("session", JSON.stringify(res.data))
              .then(() => {
                AsyncStorage.getItem("session")
                  .then((value) => {
                    console.log(value);
                    setSession(JSON.parse(value));
                    toProfile();
                  })
                  .catch((error) => console.log("3 문제"));
              })
              .catch((error) => console.log("2 문제"));
          })
          .catch((error) => console.log("1 문제"));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(route.params);
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <Pressable style={styles.cancelButton} onPress={toProfile}>
          <IonIcon
            name={"chevron-back-sharp"}
            size={25}
            style={styles.backButton}
          />

          <Text
            style={{ fontSize: 18, fontWeight: "600", paddingLeft: vw / 40 }}
          >
            프로필 변경
          </Text>
        </Pressable>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={confirm}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16, right: 0, color: "blue" }}>완료</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imgZone}>
        <Pressable style={styles.imgUploadButton} onPress={pickImage}>
          <Image
            //source={require("../../assets/bugi.png")}
            source={
              Object.keys(img).length === 0
                ? { uri: `${url}/images/${profileImg}` }
                : { uri: img?.uri }
            }
            style={styles.buttonImg}
          />
        </Pressable>
      </View>
      <View style={styles.nameZone}>
        <View>
          <Text style={{ fontSize: 18, marginLeft: vw / 20 }}>닉네임</Text>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.nameInput}
            value={nickname}
            onChangeText={setNickname}
            onSubmitEditing={confirm}
            autoCapitalize="none"
            returnKeyType="done"
            placeholder="닉네임을 입력해주세요."
          />
        </View>
      </View>
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
    justifyContent: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
    //backgroundColor: '#3064e7',
  },
  completeButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: "auto",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 20
  },
  imgZone: {
    flex: 0.35
  },
  nameZone: {
    flex: 1
  },
  imgUploadButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: vh / 7
  },
  buttonImg: {
    flex: 0.6,
    width: "80%",
    height: "80%",
    borderRadius: 100,
    borderWidth: 0.3
  },
  inputBox: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "gray",
    borderRadius: 15,
    marginTop: vh / 42,
    marginHorizontal: vw / 30
  },
  nameInput: {
    borderColor: "transparent",
    height: vh / 18,
    marginHorizontal: vw / 20
  }
});

export default ChangeProfile;
