import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TextInput,
  Pressable,
  LayoutAnimation
} from "react-native";
import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useStore from "../../../store";
import BottomTabs from "../../components/BottomTabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import api from "../../api";
import { useIsFocused } from "@react-navigation/native";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type RootStackParamList = {
  Search: undefined;
};
type SearchScreenProps = NativeStackScreenProps<RootStackParamList, "Search">;

var inputWidth = vw - vw / 5;

function SearchScreen({ route, navigation }: SearchScreenProps) {
  const { session, url } = useStore();
  const [searchWord, setSearchWord] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchTrack, setSearchTrack] = useState("");
  const [inputWidth, setInputWidth] = useState(vw - vw / 3);
  const [backWidth, setBackWidth] = useState(vw - vw / 5);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const searchInputFocusedIn = () => {
    setIsEditing(true);
    LayoutAnimation.configureNext({
      duration: 125, // 애니메이션 지속시간 (밀리초)
      update: {
        type: LayoutAnimation.Types.linear, // 애니메이션 종류
        property: LayoutAnimation.Properties.width // 애니메이션 속성
      }
    });
    setInputWidth(vw - vw / 2);
    setBackWidth(vw - vw / 3);
  };

  const searchInputFocusedOut = () => {
    setIsEditing(false);
    setSearchWord("");
    inputRef.current?.blur();
    LayoutAnimation.configureNext({
      duration: 125,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setBackWidth(vw - vw / 5);
    setInputWidth(vw - vw / 3);
  };

  const searchByWord = () => {
    navigation.navigate("SearchResult", { word: searchWord });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: vw - vw / 6,
          height: vh / 20,
          marginHorizontal: vw / 10,
          marginTop: vh / 33
        }}
      >
        <View style={[styles.searchWordBar, { width: backWidth }]}>
          <IonIcon name="search" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="검색할 단어를 입력하세요"
            style={{
              marginLeft: 10,
              height: vh / 22,
              width: inputWidth,
              backgroundColor: "#f0f0f0",
              color: "black"
            }}
            ref={inputRef}
            onChangeText={setSearchWord}
            onSubmitEditing={searchByWord}
            returnKeyType="search"
            value={searchWord}
            onPressIn={searchInputFocusedIn}
            placeholderTextColor={"grey"}
          />
        </View>
        {isEditing ? (
          <Pressable
            style={{ marginLeft: vw / 20 }}
            onPress={searchInputFocusedOut}
          >
            <Text>취소</Text>
          </Pressable>
        ) : null}
      </View>
      <BottomTabs navigation={navigation} screen="Search" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: vh,
    backgroundColor: "white"
  },
  searchWordBar: {
    backgroundColor: "#f0f0f0",
    borderRadius: 100,
    height: vh / 20,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  }
});

export default SearchScreen;
