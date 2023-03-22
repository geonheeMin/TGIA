import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TextInput
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useStore from "../../../store";
import BottomTabs from "../../components/BottomTabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import api from "../../api";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type RootStackParamList = {
  Search: undefined;
};
type SearchScreenProps = NativeStackScreenProps<RootStackParamList, "Search">;

function SearchScreen({ route, navigation }: SearchScreenProps) {
  const { session } = useStore();
  const [searchWord, setSearchWord] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchTrack, setSearchTrack] = useState("");

  const searchByWord = () => {
    setSearchWord("검색버튼누름");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchWordBar}>
        <IonIcon name="search" style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="검색할 단어를 입력하세요"
          style={{
            marginLeft: 10,
            height: 25,
            width: vw - vw / 3
          }}
          onChangeText={setSearchWord}
          onSubmitEditing={searchByWord}
          returnKeyType="search"
        />
      </View>
      <Text>{searchWord}</Text>
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
    width: vw - vw / 5,
    marginHorizontal: vw / 10,
    marginTop: vh / 33,
    height: vh / 20,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  }
});

export default SearchScreen;
