import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput
} from "react-native";
import Axios from "axios";
import useStore from "../../store";
import { tracks } from "../assets/data/track";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Home: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

const saveSession = async (data: string) => {
  try {
    await AsyncStorage.setItem("session", data);
  } catch (e) {}
};

function HomeScreen({ navigation }: HomeScreenProps) {
  const [loginId, setLoginId] = useState("");
  const { session, setSession, url } = useStore();

  const LogIn = () => {
    Axios.get(`${url}/member/get?user_id=${loginId}`)
      .then((res) => {
        console.log(res.data);
        const firstTrack = res.data.firsttrack;
        const secondTrack = res.data.secondtrack;
        const firstDepart = tracks.find(
          (item) => item.track === firstTrack
        )?.department;
        const secondDepart = tracks.find(
          (item) => item.track === secondTrack
        )?.department;
        const profileListDto = {
          member_id: res.data.member_id,
          first_department: firstDepart,
          second_department: secondDepart
        };
        Axios.post(`${url}/profile/add_college`, profileListDto)
          .then((res) => {
            AsyncStorage.setItem("session", JSON.stringify(res.data)).then(
              () => {
                AsyncStorage.getItem("session").then((value) => {
                  setSession(JSON.parse(value));
                  navigation.replace("List");
                });
              }
            );
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const test = () => {
    AsyncStorage.removeItem("session").then((res) => {
      console.log(AsyncStorage.getItem("session"));
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.informations}>
          <TextInput
            autoCapitalize="none"
            onChangeText={setLoginId}
            onSubmitEditing={LogIn}
            returnKeyType="done"
            style={styles.idInput}
          />
          <Text>{loginId}</Text>
          <TextInput secureTextEntry={true} style={styles.passwordInput} />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.registerButton} onPress={test}>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
              회원가입
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={LogIn}>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
              로그인
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  logo: {
    marginTop: vh / 2.5,
    marginBottom: vh / 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  informations: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vh / 50,
    marginTop: vh / 2.3
  },
  idInput: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "lightgrey",
    borderRadius: 3,
    width: vw / 1.75,
    height: vh / 25,
    marginBottom: vh / 75,
    color: "black"
  },
  passwordInput: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "lightgrey",
    borderRadius: 3,
    width: vw / 1.75,
    height: vh / 25
  },
  buttons: {
    marginTop: vh / 15,
    flex: 1,
    justifyContent: "center",
    flexDirection: "row"
  },
  registerButton: {
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#99a6cd",
    borderRadius: 5,
    marginRight: vw / 50
  },
  loginButton: {
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2b0eff",
    borderRadius: 5,
    marginLeft: vw / 50
  }
});

export default HomeScreen;
