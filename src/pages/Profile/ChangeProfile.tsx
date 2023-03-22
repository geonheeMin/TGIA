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

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type ChangeProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ChangeProfile"
>;

function ChangeProfile({ navigation }: ChangeProfileScreenProps) {
  const [text, setText] = useState("");
  const { session } = useStore();

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);
  const confirm = useCallback(() => {
    navigation.navigate("Profile");
    //setId('');
  }, [navigation]);

  /** 갤러리에서 이미지 선택하는 함수 */
  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res.didCancel) {
        console.log("Canceled");
      } else if (res.errorCode) {
        console.log("Errored");
      } else {
        console.log(res);
        // setImg(res.assets[0]);
      }
    });
  };

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
          {/* <Image source={require("../../assets/logo.png")} style={styles.backButtonImg} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.compliteButton}
          onPress={confirm}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16, right: 0, color: "blue" }}>완료</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imgZone}>
        <Pressable style={styles.imgUploadButton} onPress={pickImage}>
          <Image
            source={require("../../assets/bugi.png")}
            style={styles.buttonImg}
          />
        </Pressable>
      </View>
      <View style={styles.nameZone}>
        <View>
          <Text style={{ fontSize: 18, marginLeft: 10 }}>닉네임</Text>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.nameInput}
            value={text}
            onChangeText={setText}
            //onChange={e => setId(e.nativeEvent.text)}
            autoCapitalize="none"
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
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
    //backgroundColor: '#3064e7',
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
