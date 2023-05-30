import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import LocationCalc from "../../components/LocationCalc";
import useStore from "../../../store";
import IonIcon from "react-native-vector-icons/Ionicons";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

function Settings({ navigation }: SettingsScreenProps) {
  const { session, url } = useStore();

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);
  

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={toProfile}
          activeOpacity={0.5}
        >
          <IonIcon name={"chevron-back-sharp"} size={25} />
        </TouchableOpacity>
      </View>
      <LocationCalc />
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
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5,
  }
});

export default Settings;
