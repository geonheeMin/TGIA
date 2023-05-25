import * as React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView
} from "react-native";
import { useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import OctIcon from "react-native-vector-icons/Octicons";
import IonIcon from "react-native-vector-icons/Ionicons";

type BottomTabsParamList = {
  Bottom: undefined;
};

type BottomTab = NativeStackScreenProps<BottomTabsParamList, "Bottom">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function BottomTabs({ navigation, screen }: BottomTab) {
  const currentScreen = screen;

  const toList = useCallback(() => {
    navigation.replace("List");
  }, [navigation]);

  const toSearch = useCallback(() => {
    navigation.replace("Search");
  }, [navigation]);

  const toChatList = useCallback(() => {
    navigation.replace("ChatList");
  }, [navigation]);

  const toProfile = useCallback(() => {
    navigation.replace("Profile");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.bottomBar}>
      <Pressable onPress={toList} style={styles.bottomButton}>
        <OctIcon
          name="home"
          color={currentScreen === "List" ? "#336cf6" : "black"}
          size={25}
        />
        <Text style={currentScreen === "List" ? styles.onList : styles.offList}>
          홈
        </Text>
      </Pressable>
      <Pressable onPress={toSearch} style={styles.bottomButton}>
        <OctIcon
          name="search"
          size={25}
          color={currentScreen === "Search" ? "#336cf6" : "black"}
        />
        <Text
          style={
            currentScreen === "Search" ? styles.onSearch : styles.offSearch
          }
        >
          검색
        </Text>
      </Pressable>
      <Pressable onPress={toChatList} style={styles.bottomButton}>
        <IonIcon
          name="chatbubbles-outline"
          size={25}
          color={currentScreen === "ChatList" ? "#336cf6" : "black"}
        />
        <Text
          style={
            currentScreen === "ChatList"
              ? styles.onChatList
              : styles.offChatList
          }
        >
          채팅
        </Text>
      </Pressable>
      <Pressable onPress={toProfile} style={styles.bottomButton}>
        <OctIcon
          name={"person"}
          size={25}
          color={currentScreen === "Profile" ? "#336cf6" : "black"}
        />
        <Text
          style={
            currentScreen === "Profile" ? styles.onProfile : styles.offProfile
          }
        >
          프로필
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: "white",
    width: vw,
    height: vh / 11,
    borderTopWidth: 0.5,
    borderTopColor: "#d3d3d3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 20
  },
  bottomButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  onList: {
    color: "#336cf6",
    fontSize: 13.5,
    fontWeight: "600",
    marginTop: 5
  },
  offList: {
    color: "black",
    fontSize: 13.5,
    fontWeight: "600",
    marginTop: 5
  },
  onSearch: {
    color: "#336cf6",
    fontSize: 13.5,
    fontWeight: "600",
    marginTop: 5
  },
  offSearch: {
    color: "black",
    fontSize: 13.5,
    fontWeight: "600",
    marginTop: 5
  },

  onChatList: {
    color: "#336cf6",
    fontSize: 13.5,
    fontWeight: "600",
    marginTop: 5
  },
  offChatList: {
    color: "black",
    fontSize: 13.5,
    fontWeight: "600",
    marginTop: 5
  },
  onProfile: {
    color: "#336cf6",
    fontSize: 13.5,
    fontWeight: "600",
    marginTop: 5
  },
  offProfile: {
    color: "black",
    fontSize: 13.5,
    fontWeight: "600",
    marginTop: 5
  }
});

export default BottomTabs;
