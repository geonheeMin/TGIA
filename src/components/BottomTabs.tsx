import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Pressable
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import iconOnList from "../assets/design/tabbar/home_selected.png";
import iconOffList from "../assets/design/tabbar/home.png";
import iconOnChat from "../assets/design/tabbar/chat_selected.png";
import iconOffChat from "../assets/design/tabbar/chat.png";
import iconOnProfile from "../assets/design/tabbar/profile_selected.png";
import iconOffProfile from "../assets/design/tabbar/profile.png";

type BottomTabsParamList = {
  Bottom: undefined;
};

type BottomTab = NativeStackScreenProps<BottomTabsParamList, "Bottom">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function BottomTabs({ navigation, screen }: BottomTab) {
  const currentScreen = screen;
  const toList = useCallback(() => {
    navigation.navigate("List");
  }, [navigation]);

  const toChatList = useCallback(() => {
    navigation.navigate("ChatList");
  }, [navigation]);

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  return (
    <View style={styles.bottomBar}>
      <Pressable onPress={toList}>
        <Image
          source={currentScreen === "List" ? iconOnList : iconOffList}
          style={{ width: 15, height: 15 }}
        />
        <Text style={currentScreen === "List" ? styles.onList : styles.offList}>
          List
        </Text>
      </Pressable>
      <Pressable onPress={toChatList}>
        <Text
          style={
            currentScreen === "ChatList"
              ? styles.onChatList
              : styles.offChatList
          }
        >
          ChatList
        </Text>
      </Pressable>
      <Pressable onPress={toProfile}>
        <Text
          style={
            currentScreen === "Profile" ? styles.onProfile : styles.offProfile
          }
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    width: vw,
    height: vh / 10,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  onList: {
    color: "blue"
  },
  offList: {
    color: "black"
  },
  onChatList: {
    color: "blue"
  },
  offChatList: {
    color: "black"
  },
  onProfile: {
    color: "blue"
  },
  offProfile: {
    color: "black"
  }
});

export default BottomTabs;
