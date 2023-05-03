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
  LayoutAnimation
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

  /** */
  const [isNewChecked, setIsNewChecked] = useState(true);
  const [isOldChecked, setIsOldChecked] = useState(false);
  const [isMuchChecked, setIsMuchChecked] = useState(false);
  const [isLittleChecked, setIsLittleChecked] = useState(false);
  const [isHighChecked, setIsHighChecked] = useState(false);
  const [isLowChecked, setIsLowChecked] = useState(false);

  const [previousChecked, setPreviousChecked] = useState("new");
  const [currentChecked, setCurrentChecked] = useState("new");

  const [modalTop, setModalTop] = useState(-vh / 2.3);
  const [modalBackOpacity, setModalBackOpacity] = useState(0.0);
  const [modalBackZIndex, setModalBackZIndex] = useState(-50);

  const modalOpenAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setModalTop(0);
  };

  const filterModalOpen = () => {
    setModalBackOpacity(0.2);
    setModalBackZIndex(50);
    modalOpenAnimation();
  };

  const modalCloseAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setModalTop(-vh / 2.3);
  };

  const filterModalClose = () => {
    setModalBackOpacity(0);
    setModalBackZIndex(-50);
    modalCloseAnimation();
  };

  const newHandle = () => {
    setCurrentChecked("new");
  };

  const oldHandle = () => {
    setCurrentChecked("old");
  };

  const muchHandle = () => {
    setCurrentChecked("much");
  };

  const littleHandle = () => {
    setCurrentChecked("little");
  };

  const highHandle = () => {
    setCurrentChecked("high");
  };

  const lowHandle = () => {
    setCurrentChecked("low");
  };

  const adjustFilter = (checked) => {
    switch (checked) {
      case "new":
        newPosts.sort((a, b) => b.post_id - a.post_id);

        setPreviousChecked("new");
        break;
      case "old":
        newPosts.sort((a, b) => a.post_id - b.post_id);

        setPreviousChecked("old");
        break;
      case "much":
        newPosts.sort((a, b) => b.likes - a.likes);

        setPreviousChecked("much");
        break;
      case "little":
        newPosts.sort((a, b) => a.likes - b.likes);

        setPreviousChecked("little");
        break;
      case "high":
        newPosts.sort((a, b) => b.views - a.views);

        setPreviousChecked("high");
        break;
      case "little":
        newPosts.sort((a, b) => a.views - b.views);
        setPreviousChecked("little");
        break;
      default:
        cancelFilter(previousChecked);

        break;
    }
    filterModalClose();
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
    filterModalClose();
  };

  useEffect(() => {
    switch (currentChecked) {
      case "new":
        setIsNewChecked(true);
        setIsOldChecked(false);
        setIsMuchChecked(false);
        setIsLittleChecked(false);
        setIsHighChecked(false);
        setIsLowChecked(false);
        break;
      case "old":
        setIsNewChecked(false);
        setIsOldChecked(true);
        setIsMuchChecked(false);
        setIsLittleChecked(false);
        setIsHighChecked(false);
        setIsLowChecked(false);
        break;
      case "much":
        setIsNewChecked(false);
        setIsOldChecked(false);
        setIsMuchChecked(true);
        setIsLittleChecked(false);
        setIsHighChecked(false);
        setIsLowChecked(false);
        break;
      case "little":
        setIsNewChecked(false);
        setIsOldChecked(false);
        setIsMuchChecked(false);
        setIsLittleChecked(true);
        setIsHighChecked(false);
        setIsLowChecked(false);
        break;
      case "high":
        setIsNewChecked(false);
        setIsOldChecked(false);
        setIsMuchChecked(false);
        setIsLittleChecked(false);
        setIsHighChecked(true);
        setIsLowChecked(false);
        break;
      case "low":
        setIsNewChecked(false);
        setIsOldChecked(false);
        setIsMuchChecked(false);
        setIsLittleChecked(false);
        setIsHighChecked(false);
        setIsLowChecked(true);
        break;
    }
  }, [currentChecked]);

  /** */
  const writePost = useCallback(() => {
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

  const listRefresh = () => {
    setIsRefreshing(true);
    Axios.get(`${url}/post/all`)
      .then((res) => {
        res.data.sort((a, b) => b.post_id - a.post_id);
        setPosts(res.data);
        setNewPosts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    adjustFilter(currentChecked);
    setIsRefreshing(false);
  };

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
  }, [isFocused, filter]);

  useEffect(() => {
    console.log(vh);
  }, []);

  const FilterModal = () => {
    return (
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          position: "absolute",
          bottom: modalTop,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 0.34,
          borderLeftWidth: 0.34,
          borderRightWidth: 0.34,
          width: vw,
          height: vh / 2.3,
          zIndex: 55,
          backgroundColor: "white"
        }}
      >
        <FilterModal />
      </View>
      <Pressable
        style={{
          width: vw,
          height: vh,
          position: "absolute",
          bottom: 0,
          opacity: modalBackOpacity,
          backgroundColor: "black",
          zIndex: modalBackZIndex
        }}
        onPress={filterModalClose}
      >
        <View />
      </Pressable>
      <View style={styles.topBar}>
        <View style={styles.filterButton}>
          <Pressable
            onPress={() => {
              filterModalOpen();
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
      <Pressable style={styles.writeButton} onPress={writePost}>
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
    zIndex: 30,
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
