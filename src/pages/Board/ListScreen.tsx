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
import MatIcon from "react-native-vector-icons/MaterialIcons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type RootStackParamList = {
  List: undefined;
};
type ListScreenProps = NativeStackScreenProps<RootStackParamList, "List">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function ListScreen({ route, navigation }: ListScreenProps) {
  const { session, url } = useStore();
  const [posts, setPosts] = useState([{}]);
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
  const [newPosts, setNewPosts] = useState([]);
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

  const [isNewChecked, setIsNewChecked] = useState(true);
  const [isOldChecked, setIsOldChecked] = useState(false);
  const [isMuchChecked, setIsMuchChecked] = useState(false);
  const [isLittleChecked, setIsLittleChecked] = useState(false);
  const [isHighChecked, setIsHighChecked] = useState(false);
  const [isLowChecked, setIsLowChecked] = useState(false);

  const [previousChecked, setPreviousChecked] = useState("new");
  const [currentChecked, setCurrentChecked] = useState("new");

  /** */
  const onClick = useCallback(() => {
    navigation.navigate("Add");
  }, [navigation]);

  const renderItem = ({ item }) => {
    const renderBoard = {
      post_id: item.post_id,
      title: item.title,
      price: item.price,
      locationType: item.locationType,
      location_text: item.location_text,
      writer: item.writer,
      category: item.category,
      text: item.text,
      date: item.date,
      track: item.track,
      images: item.images,
      member_id: item.member_id,
      likes: item.likes,
      views: item.views,
      department: item.department,
      createdDate: item.createdDate
    };
    return <ItemList board={renderBoard} navigation={navigation} />;
  };

  const newHandle = () => {
    if (isNewChecked) {
      setPreviousChecked("new");
    } else if (isOldChecked) {
      setPreviousChecked("old");
    } else if (isMuchChecked) {
      setPreviousChecked("much");
    } else if (isLittleChecked) {
      setPreviousChecked("little");
    } else if (isHighChecked) {
      setPreviousChecked("high");
    } else if (isLowChecked) {
      setPreviousChecked("low");
    }
    setIsNewChecked(true);
    setIsOldChecked(false);
    setIsMuchChecked(false);
    setIsLittleChecked(false);
    setIsHighChecked(false);
    setIsLowChecked(false);
    setCurrentChecked("new");
  };

  const oldHandle = () => {
    if (isNewChecked) {
      setPreviousChecked("new");
    } else if (isOldChecked) {
      setPreviousChecked("old");
    } else if (isMuchChecked) {
      setPreviousChecked("much");
    } else if (isLittleChecked) {
      setPreviousChecked("little");
    } else if (isHighChecked) {
      setPreviousChecked("high");
    } else if (isLowChecked) {
      setPreviousChecked("low");
    }
    setIsNewChecked(false);
    setIsOldChecked(true);
    setIsMuchChecked(false);
    setIsLittleChecked(false);
    setIsHighChecked(false);
    setIsLowChecked(false);
    setCurrentChecked("old");
  };

  const muchHandle = () => {
    if (isNewChecked) {
      setPreviousChecked("new");
    } else if (isOldChecked) {
      setPreviousChecked("old");
    } else if (isMuchChecked) {
      setPreviousChecked("much");
    } else if (isLittleChecked) {
      setPreviousChecked("little");
    } else if (isHighChecked) {
      setPreviousChecked("high");
    } else if (isLowChecked) {
      setPreviousChecked("low");
    }
    setIsNewChecked(false);
    setIsOldChecked(false);
    setIsMuchChecked(true);
    setIsLittleChecked(false);
    setIsHighChecked(false);
    setIsLowChecked(false);
    setCurrentChecked("much");
  };

  const littleHandle = () => {
    if (isNewChecked) {
      setPreviousChecked("new");
    } else if (isOldChecked) {
      setPreviousChecked("old");
    } else if (isMuchChecked) {
      setPreviousChecked("much");
    } else if (isLittleChecked) {
      setPreviousChecked("little");
    } else if (isHighChecked) {
      setPreviousChecked("high");
    } else if (isLowChecked) {
      setPreviousChecked("low");
    }
    setIsNewChecked(false);
    setIsOldChecked(false);
    setIsMuchChecked(false);
    setIsLittleChecked(true);
    setIsHighChecked(false);
    setIsLowChecked(false);
    setCurrentChecked("little");
  };

  const highHandle = () => {
    if (isNewChecked) {
      setPreviousChecked("new");
    } else if (isOldChecked) {
      setPreviousChecked("old");
    } else if (isMuchChecked) {
      setPreviousChecked("much");
    } else if (isLittleChecked) {
      setPreviousChecked("little");
    } else if (isHighChecked) {
      setPreviousChecked("high");
    } else if (isLowChecked) {
      setPreviousChecked("low");
    }
    setIsNewChecked(false);
    setIsOldChecked(false);
    setIsMuchChecked(false);
    setIsLittleChecked(false);
    setIsHighChecked(true);
    setIsLowChecked(false);
    setCurrentChecked("high");
  };

  const lowHandle = () => {
    if (isNewChecked) {
      setPreviousChecked("new");
    } else if (isOldChecked) {
      setPreviousChecked("old");
    } else if (isMuchChecked) {
      setPreviousChecked("much");
    } else if (isLittleChecked) {
      setPreviousChecked("little");
    } else if (isHighChecked) {
      setPreviousChecked("high");
    } else if (isLowChecked) {
      setPreviousChecked("low");
    }
    setIsNewChecked(false);
    setIsOldChecked(false);
    setIsMuchChecked(false);
    setIsLittleChecked(false);
    setIsHighChecked(false);
    setIsLowChecked(true);
    setCurrentChecked("low");
  };
  const adjustFilter = (checked) => {
    switch (checked) {
      case "new":
        newPosts.sort((a, b) => b.post_id - a.post_id);
        break;
      case "old":
        newPosts.sort((a, b) => a.post_id - b.post_id);
        break;
      case "much":
        newPosts.sort((a, b) => b.likes - a.likes);
        break;
      case "little":
        newPosts.sort((a, b) => a.likes - b.likes);
        break;
      case "high":
        newPosts.sort((a, b) => b.views - a.views);
        break;
      case "little":
        newPosts.sort((a, b) => a.views - b.views);
        break;
      default:
        cancelFilter(previousChecked);
        break;
    }
  };

  const cancelFilter = (checked) => {
    switch (checked) {
      case "new":
        newPosts.sort((a, b) => b.post_id - a.post_id);
        newHandle();
        break;
      case "old":
        newPosts.sort((a, b) => a.post_id - b.post_id);
        oldHandle();
        break;
      case "much":
        newPosts.sort((a, b) => b.likes - a.likes);
        muchHandle();
        break;
      case "little":
        newPosts.sort((a, b) => a.likes - b.likes);
        littleHandle();
        break;
      case "high":
        newPosts.sort((a, b) => b.views - a.views);
        highHandle();
        break;
      case "low":
        newPosts.sort((a, b) => a.views - b.views);
        lowHandle();
        break;
      default:
        newPosts.sort((a, b) => b.post_id - a.post_id);
        newHandle();
        break;
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
    adjustFilter(currentChecked);
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
    Axios.get(`${url}/post/all`)
      .then((res) => {
        res.data.sort((a, b) => b.post_id - a.post_id);
        setPosts(res.data);
        setNewPosts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isFocused, filter, categoryAll]);

  const FilterModal = () => {
    return (
      <Modal
        transparent={true}
        animationType="none"
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(!filterModalVisible)}
      >
        <Pressable
          onPress={() => {
            cancelFilter(previousChecked);
            setFilterModalVisible(!filterModalVisible);
          }}
          style={filterModalStyles.background}
        />
        <View style={filterModalStyles.modalContainer}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                alignItems: "center",
                flex: 1,
                borderBottomWidth: 0.25,
                borderColor: "lightgrey"
              }}
            >
              <Text style={{ fontSize: 20 }}>게시글 정렬</Text>
            </View>
            <View style={filterModalStyles.filterContainer}>
              <View style={filterModalStyles.sectionContainerTop}>
                <Text style={{ flex: 2 }}>작성 일자</Text>
                <View style={{ flex: 8, flexDirection: "row" }}>
                  <View
                    style={{
                      flex: 5,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <BouncyCheckbox
                      iconStyle={{ borderRadius: 0 }}
                      innerIconStyle={{ borderRadius: 0 }}
                      fillColor="#3099fc"
                      isChecked={isNewChecked}
                      onPress={newHandle}
                    />
                    <Text style={{ fontSize: 15 }}>최신순</Text>
                  </View>
                  <View
                    style={{
                      flex: 5,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <BouncyCheckbox
                      iconStyle={{ borderRadius: 0 }}
                      innerIconStyle={{ borderRadius: 0 }}
                      fillColor="#3099fc"
                      isChecked={isOldChecked}
                      onPress={oldHandle}
                    />
                    <Text style={{ fontSize: 15 }}>오래된순</Text>
                  </View>
                </View>
              </View>
              <View style={filterModalStyles.sectionContainerMiddle}>
                <Text style={{ flex: 2 }}>관심 등록</Text>
                <View style={{ flex: 8, flexDirection: "row" }}>
                  <View
                    style={{
                      flex: 5,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <BouncyCheckbox
                      iconStyle={{ borderRadius: 0 }}
                      innerIconStyle={{ borderRadius: 0 }}
                      fillColor="#3099fc"
                      isChecked={isMuchChecked}
                      onPress={muchHandle}
                    />
                    <Text style={{ fontSize: 15 }}>많은순</Text>
                  </View>
                  <View
                    style={{
                      flex: 5,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <BouncyCheckbox
                      iconStyle={{ borderRadius: 0 }}
                      innerIconStyle={{ borderRadius: 0 }}
                      fillColor="#3099fc"
                      isChecked={isLittleChecked}
                      onPress={littleHandle}
                    />
                    <Text style={{ fontSize: 15 }}>적은순</Text>
                  </View>
                </View>
              </View>
              <View style={filterModalStyles.sectionContainerBottom}>
                <Text style={{ flex: 2 }}>조회수</Text>
                <View style={{ flex: 8, flexDirection: "row" }}>
                  <View
                    style={{
                      flex: 5,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <BouncyCheckbox
                      iconStyle={{ borderRadius: 0 }}
                      innerIconStyle={{ borderRadius: 0 }}
                      fillColor="#3099fc"
                      isChecked={isHighChecked}
                      onPress={highHandle}
                    />
                    <Text style={{ fontSize: 15 }}>높은순</Text>
                  </View>
                  <View
                    style={{
                      flex: 5,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <BouncyCheckbox
                      iconStyle={{ borderRadius: 0 }}
                      innerIconStyle={{ borderRadius: 0 }}
                      fillColor="#3099fc"
                      isChecked={isLowChecked}
                      onPress={lowHandle}
                    />
                    <Text style={{ fontSize: 15 }}>낮은순</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={filterModalStyles.buttonBar}>
              <Pressable
                onPress={() => {
                  setFilterModalVisible(!filterModalVisible);
                  cancelFilter(previousChecked);
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
                  adjustFilter(currentChecked);
                }}
              >
                <View style={filterModalStyles.applyButton}>
                  <IonIcon name="checkmark" size={25} color="white" />
                  <Text style={filterModalStyles.applyText}>적용</Text>
                </View>
              </Pressable>
            </View>
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
            <MatIcon name="sort" size={25} style={{ marginLeft: 10 }} />
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
    top: -vh / 4,
    height: vh,
    backgroundColor: "#000",
    opacity: 0.5
  },
  modalContainer: {
    backgroundColor: "white",
    borderWidth: 0.34,
    width: vw,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: vh / 2.3,
    position: "absolute",
    paddingTop: 15,
    paddingBottom: vh / 20,
    bottom: 0
  },
  filterContainer: {
    flex: 7,
    paddingHorizontal: vw / 25,
    paddingVertical: vh / 75
  },
  sectionContainerTop: {
    flex: 3,
    borderBottomWidth: 0.5,
    borderColor: "#a7a7a7",
    flexDirection: "row",
    alignItems: "center"
  },
  sectionContainerMiddle: {
    borderBottomWidth: 0.5,
    borderColor: "#a7a7a7",
    flex: 4,
    flexDirection: "row",
    alignItems: "center"
  },
  sectionContainerBottom: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  buttonBar: {
    flex: 2,
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: vw / 10,
    borderTopWidth: 0.25,
    borderColor: "lightgrey"
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
