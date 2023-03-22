import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  Platform,
  PermissionsAndroid,
  Image,
  Pressable,
  PixelRatio,
  Modal
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Axios from "axios";
import ItemList from "./ItemList";
// import postlist from "../../assets/dummy/postdata.json";
import writeIcon from "../../assets/design/pen1.png";
import useStore from "../../../store";
import BottomTabs from "../../components/BottomTabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type RootStackParamList = {
  List: undefined;
};
type ListScreenProps = NativeStackScreenProps<RootStackParamList, "List">;

interface Board {
  post_id: number;
  title: string;
  category: string;
  content: string;
  writer: string;
  date: string;
  price: number;
  place: string;
  track: string;
  img: string;
}

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ListScreen({ route, navigation }: ListScreenProps) {
  const { session } = useStore();
  const [posts, setPosts] = useState([]);
  //postlist.postlist.sort((a, b) => b.post_id - a.post_id)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const filterList = [
    { label: "전체보기", value: "all" },
    { label: "도서", value: "book" },
    { label: "필기구", value: "pencil" },
    { label: "생활/가전", value: "life" },
    { label: "의류", value: "clothes" },
    { label: "뷰티/미용", value: "beauty" },
    { label: "전자기기", value: "digital" },
    { label: "부기굿즈", value: "goods" }
  ];
  const [filter, setFilter] = useState(filterList[0]);
  const [newPosts, setNewPosts] = useState([{}]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [modalBackOpacity, setModalBackOpacity] = useState(0.0);
  const [emptyArray, setEmptyArray] = useState([]);
  /** */
  const [categoryAll, setCategoryAll] = useState(true);
  const [categoryBooks, setCategoryBooks] = useState(true);
  const [categoryPencil, setCategoryPencil] = useState(true);
  const [categoryLife, setCategoryLife] = useState(true);
  const [categoryClothes, setCategoryClothes] = useState(true);
  const [categoryBeauty, setCategoryBeauty] = useState(true);
  const [categoryDigital, setCategoryDigital] = useState(true);
  const [categoryGoods, setCategoryGoods] = useState(true);

  const [previousAll, setPreviousAll] = useState(categoryAll);
  const [previousBooks, setPreviousBooks] = useState(categoryBooks);
  const [previousPencil, setPreviousPencil] = useState(categoryPencil);
  const [previousLife, setPreviousLife] = useState(categoryLife);
  const [previousClothes, setPreviousClothes] = useState(categoryClothes);
  const [previousBeauty, setPreviousBeauty] = useState(categoryBeauty);
  const [previousDigital, setPreviousDigital] = useState(categoryDigital);
  const [previousGoods, setPreviousGoods] = useState(categoryGoods);

  /** */
  const onClick = useCallback(() => {
    navigation.navigate("Add");
  }, [navigation]);

  const filtering = () => {
    if (filter.label === filterList[0].label) {
      setNewPosts(posts);
    } else {
      setNewPosts(posts.filter((post) => post.category === filter.value));
    }
  };

  const filterCycle = () => {
    console.log("entered filterCycle");
    switch (filter.label) {
      case filterList[0].label:
        setFilter(filterList[1]);
        break;
      case filterList[1].label:
        setFilter(filterList[2]);
        break;
      case filterList[2].label:
        setFilter(filterList[3]);
        break;
      case filterList[3].label:
        setFilter(filterList[4]);
        break;
      case filterList[4].label:
        setFilter(filterList[5]);
        break;
      case filterList[5].label:
        setFilter(filterList[6]);
        break;
      case filterList[6].label:
        setFilter(filterList[7]);
        break;
      case filterList[7].label:
        setFilter(filterList[0]);
        break;
    }
  };

  // const onSelectImage = () => {
  //   launchImageLibrary(
  //     {
  //       mediaType: 'photo',
  //       maxWidth: 512,
  //       maxHeight: 512,
  //       includeBase64: Platform.OS === 'android',
  //     },
  //     res => {
  //       console.log(res);
  //       if (res.didCancel) return;
  //       setResponse(res);
  //       console.log(response?.assets[0]?.uri);
  //     },
  //   );
  // };

  const renderItem = ({ item }) => {
    const renderBoard: Board = {
      post_id: item.post_id,
      title: item.title,
      price: item.price,
      place: item.place,
      writer: item.writer,
      category: item.category,
      content: item.content,
      date: item.date,
      track: item.track,
      img: item.img
    };
    return <ItemList board={renderBoard} navigation={navigation} />;
  };

  const adjustFilter = () => {
    if (categoryAll) {
      setNewPosts(posts);
    } else {
      var booksPosts = null;
      var pencilPosts = null;
      var lifePosts = null;
      var clothesPosts = null;
      var beautyPosts = null;
      var digitalPosts = null;
      var goodsPosts = null;
      var combinedPosts = null;
      if (categoryBooks) {
        booksPosts = posts.filter(
          (item) => item.category === filterList[1].value
        );
        if (booksPosts.length > 0) {
          if (combinedPosts === null) {
            combinedPosts = [...booksPosts];
          } else {
            combinedPosts = [...combinedPosts, ...booksPosts];
          }
        }
      }
      if (categoryPencil) {
        pencilPosts = posts.filter(
          (item) => item.category === filterList[2].value
        );
        if (pencilPosts.length > 0) {
          if (combinedPosts === null) {
            combinedPosts = [...pencilPosts];
          } else {
            combinedPosts = [...combinedPosts, ...pencilPosts];
          }
        }
      }
      if (categoryLife) {
        lifePosts = posts.filter(
          (item) => item.category === filterList[3].value
        );
        if (lifePosts.length > 0) {
          if (combinedPosts === null) {
            combinedPosts = [...lifePosts];
          } else {
            combinedPosts = [...combinedPosts, ...lifePosts];
          }
        }
      }
      if (categoryClothes) {
        clothesPosts = posts.filter(
          (item) => item.category === filterList[4].value
        );
        if (clothesPosts.length > 0) {
          if (combinedPosts === null) {
            combinedPosts = [...clothesPosts];
          } else {
            combinedPosts = [...combinedPosts, ...clothesPosts];
          }
        }
      }
      if (categoryBeauty) {
        beautyPosts = posts.filter(
          (item) => item.category === filterList[5].value
        );
        console.log("beautyPosts: " + JSON.stringify(beautyPosts));
        if (beautyPosts.length > 0) {
          if (combinedPosts === null) {
            combinedPosts = [...beautyPosts];
          } else {
            combinedPosts = [...combinedPosts, ...beautyPosts];
          }
        }
      }
      if (categoryDigital) {
        digitalPosts = posts.filter(
          (item) => item.category === filterList[6].value
        );
        if (digitalPosts.length > 0) {
          if (combinedPosts === null) {
            combinedPosts = [...digitalPosts];
          } else {
            combinedPosts = [...combinedPosts, ...digitalPosts];
          }
        }
      }
      if (categoryGoods) {
        goodsPosts = posts.filter(
          (item) => item.category === filterList[7].value
        );
        if (goodsPosts.length > 0) {
          if (combinedPosts === null) {
            combinedPosts = [...goodsPosts];
          } else {
            combinedPosts = [...combinedPosts, ...goodsPosts];
          }
        }
      }
      if (combinedPosts !== null) {
        combinedPosts.sort((a, b) => a.post_id - b.post_id);
        setNewPosts(combinedPosts);
      }
    }
  };

  const listRefresh = () => {
    // setIsRefreshing(true);
    // Axios.get('http://localhost:8080/api/list')
    //   .then(res => {
    //     setPosts(res.data);
    //   })
    //   .catch(error => {
    //     console.log(error.response.data);
    //   });
    // setIsRefreshing(false);
    setIsRefreshing(true);
    adjustFilter();
    setIsRefreshing(false);
  };

  const addItem = useCallback(() => {
    navigation.navigate("Add");
  }, [navigation]);

  const toFav = useCallback(() => {
    navigation.navigate("Fav");
  }, [navigation]);

  const toChatList = useCallback(() => {
    navigation.navigate("ChatList");
  }, [navigation]);

  useEffect(() => {
    Axios.get("http://223.194.133.70:8080/post/all")
      .then((res) => {
        setPosts(res.data);
        posts.sort((a, b) => b.post_id - a.post_id);
        setNewPosts(posts);
      })
      .catch((error) => {
        console.log(error);
        console.log(posts);
      });
    listRefresh();
    console.log(newPosts);
  }, [isFocused, filter, categoryAll]);

  const FilterModal = () => {
    useEffect(() => {
      if (!categoryAll) {
        if (
          categoryBooks &&
          categoryPencil &&
          categoryLife &&
          categoryClothes &&
          categoryBeauty &&
          categoryDigital &&
          categoryGoods
        ) {
          setCategoryAll(!categoryAll);
        }
      }
    }, [
      categoryBooks,
      categoryPencil,
      categoryLife,
      categoryClothes,
      categoryBeauty,
      categoryDigital,
      categoryGoods
    ]);

    return (
      <Modal
        transparent={true}
        animationType="none"
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(!filterModalVisible)}
      >
        <Pressable
          onPress={() => setFilterModalVisible(!filterModalVisible)}
          style={filterModalStyles.background}
        />
        <View style={filterModalStyles.modalContainer}>
          <View style={{ flex: 9, borderWidth: 1 }}>
            <View style={{ alignItems: "center", flex: 1, borderWidth: 1 }}>
              <Text style={{ fontSize: 20 }}>필터</Text>
            </View>
            <View style={{ flex: 10, borderWidth: 1 }}>
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4, borderColor: "#0092fe" }}
                fillColor={"#0092fe"}
                text="전체 보기"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryAll}
                onPress={(isChecked) => {
                  setPreviousAll(categoryAll);
                  setCategoryAll(isChecked);
                  setPreviousBooks(categoryBooks);
                  setCategoryBooks(isChecked);
                  setPreviousPencil(categoryPencil);
                  setCategoryPencil(isChecked);
                  setPreviousLife(categoryLife);
                  setCategoryLife(isChecked);
                  setPreviousClothes(categoryClothes);
                  setCategoryClothes(isChecked);
                  setPreviousBeauty(categoryBeauty);
                  setCategoryBeauty(isChecked);
                  setPreviousDigital(categoryDigital);
                  setCategoryDigital(isChecked);
                  setPreviousGoods(categoryGoods);
                  setCategoryGoods(isChecked);
                }}
              />
              <BouncyCheckbox
                iconStyle={{
                  borderRadius: 4
                }}
                innerIconStyle={{
                  borderRadius: 4,
                  borderColor: categoryAll ? "lightgrey" : "#0092fe"
                }}
                fillColor={categoryAll ? "lightgrey" : "#0092fe"}
                text="도서"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryBooks}
                onPress={(isChecked) => {
                  setPreviousBooks(categoryBooks);
                  setCategoryBooks(isChecked);
                }}
                disabled={categoryAll ? true : false}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{
                  borderRadius: 4,
                  borderColor: categoryAll ? "lightgrey" : "#0092fe"
                }}
                fillColor={categoryAll ? "lightgrey" : "#0092fe"}
                text="필기구"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryPencil}
                onPress={(isChecked) => {
                  setPreviousPencil(categoryPencil);
                  setCategoryPencil(isChecked);
                }}
                disabled={categoryAll ? true : false}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{
                  borderRadius: 4,
                  borderColor: categoryAll ? "lightgrey" : "#0092fe"
                }}
                fillColor={categoryAll ? "lightgrey" : "#0092fe"}
                text="생활/가전"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryLife}
                onPress={(isChecked) => {
                  setPreviousLife(categoryLife);
                  setCategoryLife(isChecked);
                }}
                disabled={categoryAll ? true : false}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{
                  borderRadius: 4,
                  borderColor: categoryAll ? "lightgrey" : "#0092fe"
                }}
                fillColor={categoryAll ? "lightgrey" : "#0092fe"}
                text="의류"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryClothes}
                onPress={(isChecked) => {
                  setPreviousClothes(categoryClothes);
                  setCategoryClothes(isChecked);
                }}
                disabled={categoryAll ? true : false}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{
                  borderRadius: 4,
                  borderColor: categoryAll ? "lightgrey" : "#0092fe"
                }}
                fillColor={categoryAll ? "lightgrey" : "#0092fe"}
                text="뷰티/미용"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryBeauty}
                onPress={(isChecked) => {
                  setPreviousBeauty(categoryBeauty);
                  setCategoryBeauty(isChecked);
                }}
                disabled={categoryAll ? true : false}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{
                  borderRadius: 4,
                  borderColor: categoryAll ? "lightgrey" : "#0092fe"
                }}
                fillColor={categoryAll ? "lightgrey" : "#0092fe"}
                text="전자기기"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryDigital}
                onPress={(isChecked) => {
                  setPreviousDigital(categoryDigital);
                  setCategoryDigital(isChecked);
                }}
                disabled={categoryAll ? true : false}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{
                  borderRadius: 4,
                  borderColor: categoryAll ? "lightgrey" : "#0092fe"
                }}
                fillColor={categoryAll ? "lightgrey" : "#0092fe"}
                text="부기 굿즈"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryGoods}
                onPress={(isChecked) => {
                  setPreviousGoods(categoryGoods);
                  setCategoryGoods(isChecked);
                }}
                disabled={categoryAll ? true : false}
              />
            </View>
            <View style={{ flex: 10, borderWidth: 1 }}></View>
          </View>
          <View style={filterModalStyles.buttonBar}>
            <Pressable
              onPress={() => {
                setCategoryAll(previousAll);
                setCategoryBooks(previousBooks);
                setCategoryPencil(previousPencil);
                setCategoryLife(previousLife);
                setCategoryClothes(previousClothes);
                setCategoryBeauty(previousBeauty);
                setCategoryDigital(previousDigital);
                setCategoryGoods(previousGoods);
                setFilterModalVisible(!filterModalVisible);
                listRefresh();
              }}
            >
              <View style={filterModalStyles.cancelButton}>
                <IonIcon name="close" size={25} color="white" />
                <Text style={filterModalStyles.cancelText}>취소</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setFilterModalVisible(!filterModalVisible);
                listRefresh();
              }}
            >
              <View style={filterModalStyles.applyButton}>
                <IonIcon name="checkmark" size={25} color="white" />
                <Text style={filterModalStyles.applyText}>적용</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const FilterModal = () => {
    useEffect(() => {
      if (!categoryAll) {
        if (
          categoryBooks &&
          categoryPencil &&
          categoryLife &&
          categoryClothes &&
          categoryBeauty &&
          categoryDigital &&
          categoryGoods
        ) {
          setCategoryAll(!categoryAll);
        }
      }
    }, [
      categoryAll,
      categoryBooks,
      categoryPencil,
      categoryLife,
      categoryClothes,
      categoryBeauty,
      categoryDigital,
      categoryGoods
    ]);

    return (
      <Modal
        transparent={true}
        animationType="none"
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(!filterModalVisible)}
      >
        <Pressable
          onPress={() => setFilterModalVisible(!filterModalVisible)}
          style={filterModalStyles.background}
        />
        <View style={filterModalStyles.modalContainer}>
          <View style={{ flex: 9, borderWidth: 1 }}>
            <View style={{ alignItems: "center", flex: 1, borderWidth: 1 }}>
              <Text style={{ fontSize: 20 }}>필터</Text>
            </View>
            <View style={{ flex: 10, borderWidth: 1 }}>
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4 }}
                text="전체 보기"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryAll}
                onPress={(isChecked) => {
                  setCategoryAll(isChecked);
                  setCategoryBooks(isChecked);
                  setCategoryPencil(isChecked);
                  setCategoryLife(isChecked);
                  setCategoryClothes(isChecked);
                  setCategoryBeauty(isChecked);
                  setCategoryDigital(isChecked);
                  setCategoryGoods(isChecked);
                }}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4 }}
                text="도서"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryBooks}
                onPress={(isChecked) => {
                  setCategoryBooks(isChecked);
                  setCategoryAll(false);
                }}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4 }}
                text="필기구"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryPencil}
                onPress={(isChecked) => {
                  setCategoryPencil(isChecked);
                  setCategoryAll(false);
                }}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4 }}
                text="생활/가전"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryLife}
                onPress={(isChecked) => {
                  setCategoryLife(isChecked);
                  setCategoryAll(false);
                }}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4 }}
                text="의류"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryClothes}
                onPress={(isChecked) => {
                  setCategoryClothes(isChecked);
                  setCategoryAll(false);
                }}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4 }}
                text="뷰티/미용"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryBeauty}
                onPress={(isChecked) => {
                  setCategoryBeauty(isChecked);
                  setCategoryAll(false);
                }}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4 }}
                text="전자기기"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryDigital}
                onPress={(isChecked) => {
                  setCategoryDigital(isChecked);
                  setCategoryAll(false);
                }}
              />
              <BouncyCheckbox
                iconStyle={{ borderRadius: 4 }}
                innerIconStyle={{ borderRadius: 4 }}
                text="부기 굿즈"
                textStyle={{
                  marginLeft: -10,
                  color: "black",
                  textDecorationLine: "none"
                }}
                isChecked={categoryGoods}
                onPress={(isChecked) => {
                  setCategoryGoods(isChecked);
                  setCategoryAll(false);
                }}
              />
            </View>
            <View style={{ flex: 10, borderWidth: 1 }}></View>
          </View>
          <View style={filterModalStyles.buttonBar}>
            <Pressable
              onPress={() => setFilterModalVisible(!filterModalVisible)}
            >
              <View style={filterModalStyles.cancelButton}>
                <IonIcon name="close" size={25} color="white" />
                <Text style={filterModalStyles.cancelText}>취소</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setFilterModalVisible(!filterModalVisible);
                listRefresh();
              }}
            >
              <View style={filterModalStyles.applyButton}>
                <IonIcon name="checkmark" size={25} color="white" />
                <Text style={filterModalStyles.applyText}>적용</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FilterModal />
      <View style={styles.topBar}>
        <View style={styles.filterButton}>
          <Pressable
            onPress={() => {
              console.log(filterModalVisible);
              setFilterModalVisible(!filterModalVisible);
            }}
          >
            <MatIcon
              name={categoryAll ? "filter-outline" : "filter"}
              size={25}
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        </View>
        <View style={{ flex: 2, alignItems: "flex-end" }}>
          <Text>{session.username}</Text>
        </View>
      </View>
      <FlatList
        style={styles.itemList}
        data={newPosts}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        refreshControl={
          <RefreshControl onRefresh={listRefresh} refreshing={isRefreshing} />
        }
      />
      <Pressable style={styles.writeButton} onPress={onClick}>
        <Image source={writeIcon} style={{ width: 60, height: 60 }} />
      </Pressable>
      <BottomTabs navigation={navigation} screen="List" />
    </SafeAreaView>
  );
}

const filterModalStyles = StyleSheet.create({
  background: {
    flex: 1,
    top: -vh / 2,
    height: vh * 2,
    backgroundColor: "#000",
    opacity: 0.5
  },
  modalContainer: {
    backgroundColor: "white",
    borderWidth: 0.34,
    width: vw,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: vh / 1.15,
    position: "absolute",
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: vh / 20,
    bottom: 0
  },
  buttonBar: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: vw / 10
  },
  cancelButton: {
    flexDirection: "row",
    height: vh / 20,
    width: vw / 3.2,
    borderRadius: 40 / PixelRatio.get(),
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#ababab",
    marginLeft: vw / 70
  },
  cancelText: {
    marginLeft: 15,
    fontWeight: "500",
    fontSize: 18,
    color: "white"
  },
  applyButton: {
    width: vw / 3.2,
    height: vh / 20,
    borderRadius: 40 / PixelRatio.get(),
    marginRight: vw / 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#1e4eff"
  },
  applyText: {
    color: "white",
    marginLeft: 15,
    fontWeight: "500",
    fontSize: 18
  }
});

const styles = StyleSheet.create({
  container: {
    height: vh,
    backgroundColor: "white"
  },
  seperator: {
    backgroundColor: "#727272",
    opacity: 0.4,
    height: 0.34
  },
  topBar: {
    borderBottomWidth: 0.2,
    height: vh / 17.5,
    flexDirection: "row",
    alignItems: "center"
  },
  itemList: {
    marginTop: 0
  },
  filterButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderRightWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopColor: "#000000",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    backgroundColor: "transparent",
    position: "absolute",
    left: 77
  },
  writeButton: {
    backgroundColor: "#0c61fe",
    position: "absolute",
    zIndex: 999,
    width: 60,
    height: 60,
    borderRadius: 30,
    left: vw / 1.24,
    top: vh / 1.27,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default ListScreen;
