import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  Platform,
  Image,
  Pressable,
  PixelRatio,
  LayoutAnimation,
  TouchableOpacity,
  LayoutChangeEvent,
  Animated
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Axios from "axios";
import ItemList from "../Board/ItemList";
import writeIcon from "../../assets/design/pen1.png";
import useStore from "../../../store";
import BottomTabs from "../../components/BottomTabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import OctIcon from "react-native-vector-icons/Octicons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { tracks } from "../../assets/data/track";
import { Post } from "../../types/PostType";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RootStackParamList = {
  CaegorySearch: undefined;
};

type CategorySearchProps = NativeStackScreenProps<
  RootStackParamList,
  "CategorySearch"
>;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;
const sh = Dimensions.get("screen").height;

function CategorySearchScreen({ route, navigation }: CategorySearchProps) {
  const moment = require("moment");
  const insets = useSafeAreaInsets();
  const { session, url } = useStore();
  const [posts, setPosts] = useState([{}]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [newPosts, setNewPosts] = useState<Array<Post>>([]);

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

  const [rangeModalTop, setRangeModalTop] = useState(-vh / 2.3);
  const [rangeBackOpacity, setRangeBackOpacity] = useState(0.0);
  const [rangeBackZIndex, setRangeBackZIndex] = useState(-50);
  const [rangeWidth, setRangeWidth] = useState(0);

  const searchFilterDto = {
    keyword: "",
    ys: 1,
    categories: [route.params?.category]
  };
  const modalOpenAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear
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
        type: LayoutAnimation.Types.linear
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

  const adjustFilter = (checked: string) => {
    switch (checked) {
      case "new":
        newPosts.sort((a, b) =>
          moment(b.createdDate).diff(moment(a.createdDate))
        );
        setPreviousChecked("new");
        break;
      case "old":
        newPosts.sort((a, b) =>
          moment(a.createdDate).diff(moment(b.createdDate))
        );

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

  const cancelFilter = (checked: string) => {
    switch (checked) {
      case "new":
        newPosts.sort((a, b) =>
          moment(b.createdDate).diff(moment(a.createdDate))
        );
        newHandle();
        break;
      case "old":
        newPosts.sort((a, b) =>
          moment(a.createdDate).diff(moment(b.createdDate))
        );
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
        newPosts.sort((a, b) =>
          moment(b.createdDate).diff(moment(a.createdDate))
        );
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

  const renderItem = (item: Post) => {
    return <ItemList board={item} navigation={navigation} />;
  };

  const listRefresh = () => {
    setIsRefreshing(true);
    Axios.post(`${url}/detailSearchWithPaging`, searchFilterDto)
      .then((res) => {
        res.data.sort((a: Post, b: Post) =>
          moment(b.createdDate).diff(moment(a.createdDate))
        );
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
    Axios.post(`${url}/detailSearchWithPaging`, searchFilterDto)
      .then((res) => {
        res.data.sort((a: Post, b: Post) =>
          moment(b.createdDate).diff(moment(a.createdDate))
        );
        setPosts(res.data);
        setNewPosts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isFocused]);

  useEffect(() => {
    console.log(searchFilterDto);
    Axios.post(`${url}/detailSearchWithPaging`, searchFilterDto)
      .then((res) => {
        res.data.sort((a: Post, b: Post) =>
          moment(b.createdDate).diff(moment(a.createdDate))
        );
        setPosts(res.data);
        setNewPosts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (isFocused) {
      listRefresh();
    }
  }, [isFocused]);

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

  const rangeModalOpenAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setRangeModalTop(0);
  };

  const rangeModalOpen = () => {
    setRangeBackOpacity(0.2);
    setRangeBackZIndex(50);
    rangeModalOpenAnimation();
  };

  const rangeModalCloseAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setRangeModalTop(-vh / 2.3);
  };

  const rangeModalClose = () => {
    setRangeBackOpacity(0.0);
    setRangeBackZIndex(-50);
    rangeModalCloseAnimation();
  };

  const [rangeValue, setRangeValue] = useState(4);
  const [rangeAnimatedValue, setRangeAnimatedValue] = useState(
    new Animated.Value(55)
  );
  const [rangeAnimatedWidth, setRangeAnimatedWidth] = useState(
    new Animated.Value(0)
  );
  const getRangeCategory = (value) => {
    switch (value) {
      case 1:
        return "트랙";
      case 2:
        return "학부";
      case 3:
        return "단과대";
      case 4:
        return "전체";
    }
  };
  const [rangeCategory, setRangeCategory] = useState(
    getRangeCategory(rangeValue)
  );

  const getRange = (isFirst: boolean, value: number) => {
    switch (value) {
      case 1:
        return isFirst ? session?.firstTrack : session?.secondTrack;
      case 2:
        return isFirst ? session?.first_department : session?.second_department;
      case 3:
        return isFirst ? session?.first_college : session?.second_college;
      case 4:
        return "한성대학교";
    }
  };
  const [rangeText, setRangeText] = useState(getRangeCategory(rangeValue));
  const moveAnimation = (index: number) => {
    Animated.timing(rangeAnimatedValue, {
      toValue: 55 + (((index - 1) / 1) * rangeWidth) / 3.0,
      duration: 400,
      useNativeDriver: false
    }).start();
  };
  const moveWidthAnimation = (index: number) => {
    Animated.timing(rangeAnimatedWidth, {
      toValue: (((index - 1) / 1) * rangeWidth) / 3.0,
      duration: 400,
      useNativeDriver: false
    }).start();
  };
  const moveRange = (index: number) => {
    setRangeValue(index);
    moveAnimation(index);
    moveWidthAnimation(index);
    setRangeText(getRange(currentSelected, index));
    setWhichTrack(currentSelected);
  };
  const adjustRange = () => {
    setRangeCategory(getRangeCategory(rangeValue));
    if (rangeValue === 4) {
      Axios.post(`${url}/detailSearchWithPaging`, searchFilterDto)
        .then((res) => {
          res.data.sort((a: Post, b: Post) =>
            moment(b.createdDate).diff(moment(a.createdDate))
          );
          setPosts(res.data);
          setNewPosts(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const searchFilterDto = {
        track: rangeValue === 1 ? rangeText : null,
        departments: rangeValue === 2 ? [rangeText] : null,
        college: rangeValue === 3 ? rangeText : null
      };
      Axios.post(`${url}/detailSearchWithPaging`, searchFilterDto)
        .then((res) => {
          console.log(res.data.map((item) => item.department));
          setNewPosts(res.data);
        })
        .catch((err) => console.log(err));
    }
    rangeModalClose();
  };
  const resetRange = () => {
    setRangeCategory(getRangeCategory(1));
    setRangeText(getRange(true, 1));
    setWhichTrack(true);
    moveRange(1);
    Axios.post(`${url}/detailSearchWithPaging`, searchFilterDto)
      .then((res) => {
        res.data.sort((a: Post, b: Post) =>
          moment(b.createdDate).diff(moment(a.createdDate))
        );
        setPosts(res.data);
        setNewPosts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    rangeModalClose();
  };
  const cancelRange = () => {
    switch (rangeCategory) {
      case "트랙":
        setRangeValue(1);
        moveRange(1);

        break;
      case "학부":
        setRangeValue(2);
        moveRange(2);
        break;
      case "단과대":
        setRangeValue(3);
        moveRange(3);
        break;
      case "한성대학교":
        setRangeValue(4);
        moveRange(4);
        break;
    }
    setCurrentSelected(whichTrack);
    rangeModalClose();
  };
  /** currentSelected: 1트랙 검색인지 2트랙 검색인지 => true면 1트랙, false면 2트랙 */
  const [whichTrack, setWhichTrack] = useState(true);
  const [currentSelected, setCurrentSelected] = useState(whichTrack);
  const RangeModal = () => {
    return (
      <View style={rangeModalStyles.modalContainer}>
        <View style={{ flex: 1.5 }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              borderBottomWidth: 0.5,
              borderColor: "lightgrey"
            }}
          >
            <Text style={{ fontSize: 20 }}>게시글 범위 설정</Text>
          </View>
        </View>
        <View
          style={{
            height: vh / 15,
            marginTop: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: vw / 10
          }}
        >
          {[1, 2].map((value, index) => (
            <Pressable
              style={value === 1 ? { marginRight: 10 } : { marginLeft: 10 }}
              onPress={() => {
                setCurrentSelected(value === 1);
              }}
              key={index}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    borderWidth: 2,
                    marginRight: 10,
                    borderColor:
                      value === 1
                        ? currentSelected
                          ? "#1e42fe"
                          : "lightgrey"
                        : currentSelected
                        ? "lightgrey"
                        : "#1e42fe",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 15,
                      backgroundColor:
                        value === 1
                          ? currentSelected
                            ? "#1e42fe"
                            : "lightgrey"
                          : currentSelected
                          ? "lightgrey"
                          : "#1e42fe"
                    }}
                  />
                </View>
                <Text>{value} 트랙 검색</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <View
          style={{
            flex: 1.5,
            justifyContent: "center"
          }}
        >
          <View style={{ justifyContent: "center", marginTop: vh / 20 }}>
            <View
              onLayout={(event: LayoutChangeEvent) =>
                setRangeWidth(event.nativeEvent.layout.width)
              }
              style={{
                marginHorizontal: 60,
                width: "auto",
                height: 5,
                borderRadius: 10,
                backgroundColor: "lightgrey"
              }}
            />
            <Animated.View
              style={{
                position: "absolute",
                height: 5,
                left: 60,
                borderRadius: 10,
                width: rangeAnimatedWidth,
                borderColor: rangeValue >= 1 ? "#4a71fd" : "black",
                backgroundColor: rangeValue > 1 ? "#4a71fd" : "transparent"
              }}
            />
            <Animated.View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                position: "absolute",
                left: rangeAnimatedValue,
                backgroundColor: "#1e52fe",
                zIndex: 3,
                borderWidth: 1,
                borderColor: "white"
              }}
            />
            <Pressable
              style={{
                position: "absolute",
                height: 15,
                width: rangeWidth / 6,
                left: 60
              }}
              onPress={() => moveRange(1)}
            >
              <View />
            </Pressable>
            {[1, 2, 3, 4].map((value, index) => (
              <Pressable
                style={{
                  position: "absolute",
                  height: 15,
                  width: 20,
                  alignItems: "center",
                  left: 50 + ((value - 1) * rangeWidth) / 3
                }}
                onPress={() => moveRange(value)}
                key={index}
              >
                <View
                  style={{
                    height: 15,
                    width: 3,
                    borderRadius: 5,
                    backgroundColor: rangeValue >= value ? "#1e52fe" : "grey"
                  }}
                />
              </Pressable>
            ))}
            <Pressable
              style={{
                position: "absolute",
                height: 15,
                width: rangeWidth / 3,
                left: 60 + rangeWidth / 6
              }}
              onPress={() => moveRange(2)}
            >
              <View />
            </Pressable>
            <Pressable
              style={{
                position: "absolute",
                height: 15,
                width: rangeWidth / 3,
                left: 60 + rangeWidth / 2
              }}
              onPress={() => moveRange(3)}
            >
              <View />
            </Pressable>
            <Pressable
              style={{
                position: "absolute",
                height: 15,
                width: rangeWidth / 6,
                left: 60 + (5 * rangeWidth) / 6
              }}
              onPress={() => moveRange(4)}
            >
              <View />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            flex: 3,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 23, fontWeight: "bold", color: "#1e52fe" }}>
            {getRange(currentSelected, rangeValue)}
          </Text>
          <Text style={{ fontSize: 18, marginTop: 10 }}>
            내에서 게시글을 찾습니다.
          </Text>
        </View>
        <View style={rangeModalStyles.buttonBar}>
          <Pressable onPress={resetRange}>
            <View style={rangeModalStyles.cancelButton}>
              <IonIcon name="refresh" size={25} color="white" />
              <Text style={rangeModalStyles.cancelText}>초기화</Text>
            </View>
          </Pressable>
          <Pressable onPress={adjustRange}>
            <View style={rangeModalStyles.applyButton}>
              <IonIcon name="checkmark" size={25} color="white" />
              <Text style={rangeModalStyles.applyText}>적용</Text>
            </View>
          </Pressable>
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
      ></Pressable>
      <View style={styles.topBar}>
        <View style={styles.topBarLeftSide}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IonIcon name={"chevron-back-sharp"} size={25} />
              <Text style={{ marginLeft: 5, fontSize: 18, fontWeight: "bold" }}>
                {route.params?.category}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.topBarRightSide}>
          <View style={styles.searchButton}>
            <Pressable
              onPress={() => {
                navigation.navigate("Search");
              }}
            >
              <OctIcon name="search" size={20} style={{ marginRight: 10 }} />
            </Pressable>
          </View>
          <View style={styles.filterButton}>
            <Pressable
              onPress={() => {
                filterModalOpen();
              }}
            >
              <MatIcon name="sort" size={25} style={{ marginLeft: 10 }} />
            </Pressable>
          </View>
        </View>
        {/* <View style={{ flex: 2, alignItems: "flex-end" }}>
          <Text>{session.username}</Text>
        </View> */}
      </View>
      <View
        style={{ marginTop: 0, height: vh - vh / 11 - vh / 17.5 - insets.top }}
      >
        <FlatList
          data={newPosts}
          renderItem={({ item }: { item: Post }) => renderItem(item)}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
          refreshControl={
            <RefreshControl onRefresh={listRefresh} refreshing={isRefreshing} />
          }
        />
      </View>
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

const rangeModalStyles = StyleSheet.create({
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
    flex: 1.5,
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
    backgroundColor: "lightgrey",
    opacity: 0.4,
    height: 0.5
  },
  topBar: {
    borderBottomWidth: 0.2,
    height: Platform.OS === "ios" ? vh / 17.5 : vh / 15,
    flexDirection: "row",
    alignItems: "center"
  },
  topBarLeftSide: {
    flex: 1,
    height: vh / 17.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 5
  },
  topBarRightSide: {
    flex: 1,
    height: vh / 17.5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 5
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    transform: [{ scaleX: -1 }]
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
    marginLeft: 5
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

export default CategorySearchScreen;
