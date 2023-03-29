import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState, useEffect, useTransition } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";
import { ScreenContainer } from "react-native-screens";
import logo from "../../assets/logo.png";
import api from "../api";
import Axios from "axios";
import useStore from "../../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Home: undefined;
};

type member = {
  user_id: number;
  id: string;
  username: string;
  email: string;
  profile_img: string;
  trackA: string;
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
  const memberlist = require("../assets/dummy/member.json");
  const [loginId, setLoginId] = useState("");
  const { session, setSession, url } = useStore();

  const LogIn = () => {
    Axios.get(`${url}/member/get?user_id=${loginId}`)
      .then((res) => {
        console.log(JSON.stringify(res.data));
        AsyncStorage.setItem("session", JSON.stringify(res.data)).then(() => {
          AsyncStorage.getItem("session").then((value) => {
            setSession(JSON.parse(value));
            navigation.navigate("List");
          });
        });
      })
      .catch((error) => console.log(error));
    // const stringifyUser = JSON.stringify(user);
    // AsyncStorage.setItem("session", stringifyUser).then(() => {
    //   AsyncStorage.getItem("session").then((value) => {
    //     setSession(JSON.parse(value));
    //     navigation.navigate("List");
    //   });
    // });
  };

  const test = () => {
    AsyncStorage.removeItem("session").then((res) => {
      console.log(AsyncStorage.getItem("session"));
    });
  };
  let [isPending, startTransition] = useTransition();
  // useEffect(() => {
  //   Axios.get<Blob>('http://localhost:8080/api/image', {
  //     params: {
  //       id: '1',
  //     },
  //     responseType: 'blob',
  //   }).then(res => {
  //     const myFile = new Blob([res.data]);
  //     setImgdb(myFile);
  //   });
  // }, []);

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
    height: 30,
    marginBottom: vh / 75
  },
  passwordInput: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "lightgrey",
    borderRadius: 3,
    width: vw / 1.75,
    height: 30
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
