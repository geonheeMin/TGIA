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
import Axios from "axios";
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
  const [popularList, setPopularList] = useState([]);

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

  useEffect(() => {
    Axios.get(`${url}/getTop10keywords`)
      .then((res) => {
        console.log(res.data);
        if (res.data.length >= 10) {
          setPopularList(res.data);
        } else {
          setPopularList([
            "아이폰",
            "맥북",
            "맥북 에어",
            "부기",
            "과잠",
            "z플립4",
            "아이패드",
            "자전거",
            "자바",
            "부기굿즈"
          ]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
      <View
        style={{
          marginHorizontal: vw / 20,
          height: vh / 3,
          marginTop: vh / 15,
          paddingHorizontal: 5,
          flexDirection: "column"
        }}
      >
        <View>
          <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
            인기 검색어
          </Text>
        </View>
        <View
          style={{ marginTop: 10, height: 1, backgroundColor: "lightgrey" }}
        />
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 7.5,
            marginTop: 15
          }}
        >
          <View
            style={{
              width: (vw - vw / 10 - 40) / 2,
              height: vh / 4.5,

              justifyContent: "space-around"
            }}
          >
            {popularList.map((item, index) => {
              if (index < 5) {
                return (
                  <View key={index}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontWeight: "bold",
                          width: 20,
                          color: "blue"
                        }}
                      >
                        {index + 1}
                      </Text>
                      <Text style={{ paddingLeft: 10, fontWeight: "600" }}>
                        {item}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: 5,
                        marginHorizontal: 5,
                        height: 1,
                        backgroundColor: "lightgrey"
                      }}
                    />
                  </View>
                );
              }
            })}
          </View>
          <View
            style={{
              width: (vw - vw / 10 - 40) / 2,
              height: vh / 4.5,
              justifyContent: "space-around",
              marginLeft: 10
            }}
          >
            {popularList.map((item, index) => {
              if (index >= 5) {
                return (
                  <View key={index}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontWeight: "bold",
                          width: 20,
                          color: "blue"
                        }}
                      >
                        {index + 1}
                      </Text>
                      <Text style={{ fontWeight: "600", paddingLeft: 10 }}>
                        {item}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: 5,
                        marginHorizontal: 5,
                        height: 1,
                        backgroundColor: "lightgrey"
                      }}
                    />
                  </View>
                );
              }
            })}
          </View>
        </View>
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
