import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TextInput,
  Pressable,
  LayoutAnimation,
  PixelRatio,
  Platform
} from "react-native";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useStore from "../../../store";
import BottomTabs from "../../components/BottomTabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import Axios from "axios";
import ItemList from "../Board/ItemList";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Post } from "../../types/PostType";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type RootStackParamList = {
  SearchResult: undefined;
};
type SearchResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SearchResult"
>;

function SearchResultScreen({ route, navigation }: SearchResultScreenProps) {
  const { session, url } = useStore();
  const params = route.params;
  const insets = useSafeAreaInsets();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchWord, setSearchWord] = useState(params?.word);
  const [inputWidth, setInputWidth] = useState(vw - vw / 2.5);
  const [backWidth, setBackWidth] = useState(vw - vw / 4);
  const [isEditing, setIsEditing] = useState(false);
  const [results, setResults] = useState([{}]);
  /** 게시글 정렬 기준 필터 */
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isNewChecked, setIsNewChecked] = useState(true);
  const [isOldChecked, setIsOldChecked] = useState(false);
  const [isMuchChecked, setIsMuchChecked] = useState(false);
  const [isLittleChecked, setIsLittleChecked] = useState(false);
  const [isHighChecked, setIsHighChecked] = useState(false);
  const [isLowChecked, setIsLowChecked] = useState(false);
  const [previousSortChecked, setPreviousSortChecked] = useState("new");
  const [currentSortChecked, setCurrentSortChecked] = useState("new");

  const [whichModal, setWhichModal] = useState("");

  const [modalTop, setModalTop] = useState(-vh / 2.3);
  const [modalBackOpacity, setModalBackOpacity] = useState(0.0);
  const [modalBackZIndex, setModalBackZIndex] = useState(-50);

  const [placeFilterChecked, setPlaceFilterChecked] = useState(false);
  const [categoryFilterChecked, setCategoryFilterChecked] = useState(false);
  const [departmentFilterChecked, setDepartmentFilterChecked] = useState(false);

  const searchByWord = () => {
    const searchFilterDto = {
      keyword: searchWord,
      locations: placeFilterChecked === false ? null : getPlaceList(),
      categories: categoryFilterChecked === false ? null : getCategoryList(),
      departments:
        departmentFilterChecked === false ? null : getDepartmentList()
    };
    console.log(searchFilterDto);
    Axios.post(`${url}/detailSearchWithPaging`, searchFilterDto)
      .then((res) => {
        setResults(res.data);
        setIsLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  const sortModalOpenAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setModalTop(0);
  };

  const sortModalOpen = () => {
    setModalBackOpacity(0.2);
    setModalBackZIndex(50);
    setWhichModal("sort");
    sortModalOpenAnimation();
  };

  const sortModalCloseAnimaion = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setModalTop(-vh / 2.3);
  };

  const sortModalClose = () => {
    setModalBackOpacity(0);
    setModalBackZIndex(-50);
    setWhichModal("");
    sortModalCloseAnimaion();
  };

  /** 게시글 거래 장소 필터
   * placeFilterChecked = 다른 요소가 전부 false면 false, 하나라도 true면 true. 필터 체크된 게 있는지 없는지 체크하는 용도
   * placeFilterList[0]부터 상상관, 공학관, 미래관, 인성관, 창의관, 낙산관, 풋살장
   */
  const [placeModalTop, setPlaceModalTop] = useState(-vh / 1.65);
  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [placeFilterList, setPlaceFilterList] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);
  const [tempPlaceList, setTempPlaceList] = useState([...placeFilterList]);
  const placeModalOpenAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setPlaceModalTop(0);
  };

  const placeModalOpen = () => {
    setPlaceModalVisible(!placeModalVisible);
    setTempPlaceList([...placeFilterList]);
    setModalBackOpacity(0.2);
    setModalBackZIndex(50);
    setWhichModal("place");
    placeModalOpenAnimation();
  };

  const placeModalCloseAnimaion = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setPlaceModalTop(-vh / 1.65);
  };

  const placeModalClose = () => {
    setModalBackOpacity(0);
    setModalBackZIndex(-50);
    setWhichModal("");
    placeModalCloseAnimaion();
  };

  const handlePlaceFilterList = (index) => {
    tempPlaceList[index] = !tempPlaceList[index];
  };
  const [convertPlaceList, setConvertPlaceList] = useState([]);
  const setPlaceText = (index) => {
    switch (index) {
      case 0:
        return "상상관";
      case 1:
        return "공학관";
      case 2:
        return "미래관";
      case 3:
        return "인성관";
      case 4:
        return "창의관";
      case 5:
        return "낙산관";
      case 6:
        return "풋살장";
      case 7:
        return "상상빌리지";
    }
  };
  const getPlaceList = () => {
    convertPlaceList.length = 0;
    placeFilterList.map((item, index) => {
      if (item) {
        convertPlaceList.push(setPlaceText(index));
      }
    });
    convertPlaceList.push("상관없음");
    return convertPlaceList;
  };
  const adjustPlaceFilter = () => {
    tempPlaceList.map((item, index) => {
      placeFilterList[index] = item;
    });
    searchByWord();
    closeModal(whichModal);
  };
  const resetPlaceFilter = () => {
    placeFilterList.map((item, index) => {
      placeFilterList[index] = false;
    });
    setPlaceFilterChecked(false);
    searchByWord();
    closeModal(whichModal);
  };

  /** 게시글 카테고리 필터
   * categoryFilterChecked = 다른 요소가 전부 false면 false, 하나라도 true면 true. 필터 체크된 게 있는지 없는지 체크하는 용도
   * categoryFilterList[1]부터 전공도서, 필기구, 생활가전, 의류, 전자기기, 부기굿즈
   */
  const [categoryModalTop, setCategoryModalTop] = useState(-vh / 1.65);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categoryFilterList, setCategoryFilterList] = useState([
    false,
    false,
    false,
    false,
    false,
    false
  ]);
  const [tempCategoryList, setTempCategoryList] = useState([
    ...categoryFilterList
  ]);
  const categoryModalOpenAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setCategoryModalTop(0);
  };

  const categoryModalOpen = () => {
    setTempCategoryList([...categoryFilterList]);
    setModalBackOpacity(0.2);
    setModalBackZIndex(50);
    setWhichModal("category");
    categoryModalOpenAnimation();
  };

  const categoryModalCloseAnimaion = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setCategoryModalTop(-vh / 1.65);
  };

  const categoryModalClose = () => {
    setModalBackOpacity(0);
    setModalBackZIndex(-50);
    setWhichModal("");
    categoryModalCloseAnimaion();
  };

  const handleCategoryFilterList = (index) => {
    tempCategoryList[index] = !tempCategoryList[index];
  };
  const [convertCategoryList, setConvertCategoryList] = useState([]);
  const setCategoryText = (index) => {
    switch (index) {
      case 0:
        return "도서";
      case 1:
        return "필기구";
      case 2:
        return "생활가전";
      case 3:
        return "패션의류";
      case 4:
        return "전자기기";
      case 5:
        return "부기굿즈";
    }
  };
  const getCategoryList = () => {
    convertCategoryList.length = 0;
    categoryFilterList.map((item, index) => {
      if (item) {
        convertCategoryList.push(setCategoryText(index));
      }
    });
    return convertCategoryList;
  };
  const adjustCategoryFilter = () => {
    var count = 0;
    setCategoryModalVisible(!categoryModalVisible);
    tempCategoryList.map((item, index) => {
      categoryFilterList[index] = item;
    });
    searchByWord();
    closeModal(whichModal);
  };
  const resetCategoryFilter = () => {
    setCategoryModalVisible(!categoryModalVisible);
    categoryFilterList.map((item, index) => {
      categoryFilterList[index] = false;
    });
    setCategoryFilterChecked(false);
    searchByWord();
    closeModal(whichModal);
  };

  /** 게시글 학부별 필터 
   * departmentFilterChecked = 다른 요소가 전부 false면 false, 하나라도 true면 true. 필터 체크된 게 있는지 없는지 체크하는 용도
   * departmentFilterList[1]부터 크리에이티브인문학부, 예술학부, 사회과학부, 글로벌패션과학부,
    ICT디자인학부, 뷰티디자매니지먼학부, 컴퓨터공학부, 기계전자공학부,
    IT융합공학부, 스마트경영공학부, 스마팩토리컨설팅학부
   */
  const [departmentModalTop, setDepartmentModalTop] = useState(-vh / 1.65);
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
  const [departmentFilterList, setDepartmentFilterList] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);
  const [tempDepartmentList, setTempDepartmentList] = useState([
    ...departmentFilterList
  ]);
  const departmentModalOpenAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setDepartmentModalTop(0);
  };

  const departmentModalOpen = () => {
    setTempDepartmentList([...departmentFilterList]);
    setModalBackOpacity(0.2);
    setModalBackZIndex(50);
    setWhichModal("department");
    departmentModalOpenAnimation();
  };

  const departmentModalCloseAnimaion = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setDepartmentModalTop(-vh / 1.65);
  };

  const departmentModalClose = () => {
    setModalBackOpacity(0);
    setModalBackZIndex(-50);
    setWhichModal("");
    departmentModalCloseAnimaion();
  };
  const handleDepartmentFilterList = (index) => {
    tempDepartmentList[index] = !tempDepartmentList[index];
  };
  const [convertDepartmentList, setConvertDepartmentList] = useState([]);
  const setDepartmentText = (index) => {
    switch (index) {
      case 0:
        return "크리에이티브인문학부";
      case 1:
        return "예술학부";
      case 2:
        return "사회과학부";
      case 3:
        return "글로벌패션산업학부";
      case 4:
        return "ICT디자인학부";
      case 5:
        return "뷰티디자인매니지먼트학부";
      case 6:
        return "컴퓨터공학부";
      case 7:
        return "기계전자공학부";
      case 8:
        return "IT융합공학부";
      case 9:
        return "스마트경영공학부";
      case 10:
        return "스마트팩토리컨설팅학부";
    }
  };
  const getDepartmentList = () => {
    convertDepartmentList.length = 0;
    departmentFilterList.map((item, index) => {
      if (item) {
        convertDepartmentList.push(setDepartmentText(index));
      }
    });
    return convertDepartmentList;
  };
  const adjustDepartmentFilter = () => {
    var count = 0;
    setDepartmentModalVisible(!departmentModalVisible);
    tempDepartmentList.map((item, index) => {
      departmentFilterList[index] = item;
    });
    searchByWord();
    closeModal(whichModal);
  };
  const resetDepartmentFilter = () => {
    setDepartmentModalVisible(!departmentModalVisible);
    departmentFilterList.map((item, index) => {
      departmentFilterList[index] = false;
    });
    setDepartmentFilterChecked(false);
    searchByWord();
    closeModal(whichModal);
  };

  const isFocused = useIsFocused();
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
    setSearchWord(searchWord);
    LayoutAnimation.configureNext({
      duration: 125,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.width
      }
    });
    setBackWidth(vw - vw / 4);
    setInputWidth(vw - vw / 2.5);
    inputRef.current?.blur();
  };

  const toBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }: Post) => {
    return <ItemList board={item} navigation={navigation} />;
  };

  const newHandle = () => {
    setCurrentSortChecked("new");
  };

  const oldHandle = () => {
    setCurrentSortChecked("old");
  };

  const muchHandle = () => {
    setCurrentSortChecked("much");
  };

  const littleHandle = () => {
    setCurrentSortChecked("little");
  };

  const highHandle = () => {
    setCurrentSortChecked("high");
  };

  const lowHandle = () => {
    setCurrentSortChecked("low");
  };

  const adjustSort = (checked) => {
    switch (checked) {
      case "new":
        results.sort((a, b) => b.post_id - a.post_id);

        setPreviousSortChecked("new");
        break;
      case "old":
        results.sort((a, b) => a.post_id - b.post_id);

        setPreviousSortChecked("old");
        break;
      case "much":
        results.sort((a, b) => b.likes - a.likes);

        setPreviousSortChecked("much");
        break;
      case "little":
        results.sort((a, b) => a.likes - b.likes);

        setPreviousSortChecked("little");
        break;
      case "high":
        results.sort((a, b) => b.views - a.views);

        setPreviousSortChecked("high");
        break;
      case "little":
        results.sort((a, b) => a.views - b.views);
        setPreviousSortChecked("little");
        break;
      default:
        cancelSort(previousSortChecked);

        break;
    }
    closeModal(whichModal);
  };

  const cancelSort = (checked) => {
    switch (checked) {
      case "new":
        results.sort((a, b) => b.post_id - a.post_id);
        newHandle();
        break;
      case "old":
        results.sort((a, b) => a.post_id - b.post_id);
        oldHandle();
        break;
      case "much":
        results.sort((a, b) => b.likes - a.likes);
        muchHandle();
        break;
      case "little":
        results.sort((a, b) => a.likes - b.likes);
        littleHandle();
        break;
      case "high":
        results.sort((a, b) => b.views - a.views);
        highHandle();
        break;
      case "low":
        results.sort((a, b) => a.views - b.views);
        lowHandle();
        break;
      default:
        results.sort((a, b) => b.post_id - a.post_id);
        newHandle();
        break;
    }
    closeModal(whichModal);
  };

  useEffect(() => {
    switch (currentSortChecked) {
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
  }, [currentSortChecked]);

  const FilterModal = () => {
    return (
      <View style={sortModalStyles.modalContainer}>
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
          <View style={sortModalStyles.filterContainer}>
            <View style={sortModalStyles.sectionContainerTop}>
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
            <View style={sortModalStyles.sectionContainerMiddle}>
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
            <View style={sortModalStyles.sectionContainerBottom}>
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
          <View style={sortModalStyles.buttonBar}>
            <Pressable
              onPress={() => {
                cancelSort(previousSortChecked);
              }}
            >
              <View style={sortModalStyles.cancelButton}>
                <IonIcon name="refresh" size={25} color="white" />
                <Text style={sortModalStyles.cancelText}>초기화</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                adjustSort(currentSortChecked);
              }}
            >
              <View style={sortModalStyles.applyButton}>
                <IonIcon name="checkmark" size={25} color="white" />
                <Text style={sortModalStyles.applyText}>적용</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderPlaceFilter = ({ data, index }) => {
    const placeText = setPlaceText(index);
    return (
      <BouncyCheckbox
        text={placeText}
        textStyle={{ textDecorationLine: "none", color: "black" }}
        isChecked={tempPlaceList[index]}
        onPress={() => {
          setPlaceFilterChecked(true);
          handlePlaceFilterList(index);
        }}
        fillColor="#3099fc"
      />
    );
  };

  const PlaceModal = () => {
    return (
      <View style={placeFilterModalStyles.modalContainer}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignItems: "center",
              flex: 1,
              borderBottomWidth: 0.25,
              borderColor: "lightgrey"
            }}
          >
            <Text style={{ fontSize: 20 }}>거래 장소</Text>
          </View>
          <View style={{ flex: 7.5 }}>
            <FlatList
              style={{
                paddingHorizontal: vh / 50,
                paddingVertical: vw / 40
              }}
              data={tempPlaceList}
              ItemSeparatorComponent={() => (
                <View style={{ height: vh / 50, width: vw }} />
              )}
              renderItem={(item, index) => renderPlaceFilter(item, index)}
            />
          </View>
          <View style={placeFilterModalStyles.buttonBar}>
            <Pressable onPress={resetPlaceFilter}>
              <View style={placeFilterModalStyles.cancelButton}>
                <IonIcon name="close" size={25} color="white" />
                <Text style={placeFilterModalStyles.cancelText}>취소</Text>
              </View>
            </Pressable>
            <Pressable onPress={adjustPlaceFilter}>
              <View style={placeFilterModalStyles.applyButton}>
                <IonIcon name="checkmark" size={25} color="white" />
                <Text style={placeFilterModalStyles.applyText}>적용</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryFilter = ({ data, index }) => {
    const categoryText = setCategoryText(index);
    return (
      <BouncyCheckbox
        text={categoryText}
        textStyle={{ textDecorationLine: "none", color: "black" }}
        isChecked={tempCategoryList[index]}
        onPress={() => {
          setCategoryFilterChecked(true);
          handleCategoryFilterList(index);
        }}
        fillColor="#3099fc"
      />
    );
  };

  const CategoryModal = () => {
    return (
      <View style={categoryFilterModalStyles.modalContainer}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignItems: "center",
              flex: 1,
              borderBottomWidth: 0.25,
              borderColor: "lightgrey"
            }}
          >
            <Text style={{ fontSize: 20 }}>카테고리</Text>
          </View>
          <View style={{ flex: 7.5 }}>
            <FlatList
              style={{
                paddingHorizontal: vh / 50,
                paddingVertical: vw / 40
              }}
              data={categoryFilterList}
              ItemSeparatorComponent={() => (
                <View style={{ height: vh / 50, width: vw }} />
              )}
              renderItem={(item, index) => renderCategoryFilter(item, index)}
            />
          </View>
          <View style={categoryFilterModalStyles.buttonBar}>
            <Pressable onPress={resetCategoryFilter}>
              <View style={categoryFilterModalStyles.cancelButton}>
                <IonIcon name="refresh" size={25} color="white" />
                <Text style={categoryFilterModalStyles.cancelText}>초기화</Text>
              </View>
            </Pressable>
            <Pressable onPress={adjustCategoryFilter}>
              <View style={categoryFilterModalStyles.applyButton}>
                <IonIcon name="checkmark" size={25} color="white" />
                <Text style={categoryFilterModalStyles.applyText}>적용</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderDepartmentFilter = ({ data, index }) => {
    const departmentText = setDepartmentText(index);
    return (
      <BouncyCheckbox
        text={departmentText}
        textStyle={{ textDecorationLine: "none", color: "black" }}
        isChecked={tempDepartmentList[index]}
        onPress={() => {
          setDepartmentFilterChecked(true);
          handleDepartmentFilterList(index);
        }}
        fillColor="#3099fc"
      />
    );
  };

  const DepartmentModal = () => {
    return (
      <View style={departmentFilterModalStyles.modalContainer}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignItems: "center",
              flex: 1,
              borderBottomWidth: 0.25,
              borderColor: "lightgrey"
            }}
          >
            <Text style={{ fontSize: 20 }}>학부별</Text>
          </View>
          <View style={{ flex: 7.5 }}>
            <FlatList
              style={{
                paddingHorizontal: vh / 50
              }}
              data={departmentFilterList}
              ItemSeparatorComponent={() => (
                <View style={{ height: vh / 50, width: vw }} />
              )}
              renderItem={(item, index) => renderDepartmentFilter(item, index)}
            />
          </View>
          <View style={departmentFilterModalStyles.buttonBar}>
            <Pressable onPress={resetDepartmentFilter}>
              <View style={departmentFilterModalStyles.cancelButton}>
                <IonIcon name="refresh" size={25} color="white" />
                <Text style={departmentFilterModalStyles.cancelText}>
                  초기화
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={adjustDepartmentFilter}>
              <View style={departmentFilterModalStyles.applyButton}>
                <IonIcon name="checkmark" size={25} color="white" />
                <Text style={departmentFilterModalStyles.applyText}>적용</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    searchByWord();
    adjustSort(currentSortChecked);
    console.log(vh);
  }, []);

  useEffect(() => {
    var count = 0;
    tempPlaceList.map((item) => {
      if (item) {
        count = count + 1;
        console.log(count);
      }
    });
    if (count == 0) {
      setPlaceFilterChecked(false);
    }
  }, [
    tempPlaceList[0],
    tempPlaceList[1],
    tempPlaceList[2],
    tempPlaceList[3],
    tempPlaceList[4],
    tempPlaceList[5]
  ]);

  useEffect(() => {
    var count = 0;
    tempCategoryList.map((item) => {
      if (item) {
        count = count + 1;
        console.log(count);
      }
    });
    if (count == 0) {
      setCategoryFilterChecked(false);
    }
  }, [
    tempCategoryList[0],
    tempCategoryList[1],
    tempCategoryList[2],
    tempCategoryList[3],
    tempCategoryList[4],
    tempCategoryList[5]
  ]);

  useEffect(() => {
    var count = 0;
    tempDepartmentList.map((item) => {
      if (item) {
        count = count + 1;
        console.log(count);
      }
    });
    if (count == 0) {
      setDepartmentFilterChecked(false);
    }
  }, [
    tempDepartmentList[0],
    tempDepartmentList[1],
    tempDepartmentList[2],
    tempDepartmentList[3],
    tempDepartmentList[4],
    tempDepartmentList[5],
    tempDepartmentList[6],
    tempDepartmentList[7],
    tempDepartmentList[8],
    tempDepartmentList[9],
    tempDepartmentList[10]
  ]);

  const closeModal = (modal) => {
    switch (modal) {
      case "sort":
        sortModalClose();
        break;
      case "place":
        placeModalClose();
        break;
      case "category":
        categoryModalClose();
        break;
      case "department":
        departmentModalClose();
        break;
    }
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
      <View
        style={{
          position: "absolute",
          bottom: placeModalTop,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 0.34,
          borderLeftWidth: 0.34,
          borderRightWidth: 0.34,
          width: vw,
          height: vh / 1.65,
          zIndex: 55,
          backgroundColor: "white"
        }}
      >
        <PlaceModal />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: categoryModalTop,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 0.34,
          borderLeftWidth: 0.34,
          borderRightWidth: 0.34,
          width: vw,
          height: vh / 1.65,
          zIndex: 55,
          backgroundColor: "white"
        }}
      >
        <CategoryModal />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: departmentModalTop,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 0.34,
          borderLeftWidth: 0.34,
          borderRightWidth: 0.34,
          width: vw,
          height: vh / 1.65,
          zIndex: 55,
          backgroundColor: "white"
        }}
      >
        <DepartmentModal />
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
        onPress={() => closeModal(whichModal)}
      >
        <View />
      </Pressable>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: vw - vw / 6,
          height: vh / 20,
          paddingLeft: vw / 50,
          marginTop: vh / 90
        }}
      >
        <Pressable
          onPress={toBack}
          style={{ marginLeft: vw / 50, marginRight: vw / 30 }}
        >
          <IonIcon name={"chevron-back-sharp"} size={30} />
        </Pressable>
        <View style={[styles.searchWordBar, { width: backWidth }]}>
          <IonIcon name="search" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="검색할 단어를 입력하세요"
            placeholderTextColor={"grey"}
            style={{
              marginLeft: 10,
              height: vh / 22,
              width: inputWidth,
              backgroundColor: "#f0f0f0",
              color: "black"
            }}
            ref={inputRef}
            onChangeText={setSearchWord}
            onSubmitEditing={() => {
              searchByWord();
              searchInputFocusedOut();
            }}
            returnKeyType="search"
            value={searchWord}
            onPressIn={searchInputFocusedIn}
          />
        </View>
        {isEditing ? (
          <Pressable
            style={{
              marginLeft: vw / 20,
              marginHorizontal: "auto",
              height: vh / 22,
              justifyContent: "center"
            }}
            onPress={searchInputFocusedOut}
          >
            <Text style={{ fontSize: 15 }}>취소</Text>
          </Pressable>
        ) : (
          <Pressable
            style={{
              marginLeft: vw / (vw + 10),
              marginHorizontal: "auto",
              height: vh / 22,
              justifyContent: "center"
            }}
            onPress={() => {
              sortModalOpen();
            }}
          >
            <MatIcon name="sort" size={25} style={{ marginLeft: 10 }} />
          </Pressable>
        )}
      </View>
      <View style={{ marginTop: vh / 77, width: vw, borderWidth: 0.34 }} />
      <View
        style={{
          width: vw,
          height: vh / 17.5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 0.5
        }}
      >
        <Pressable
          style={{
            borderWidth: 0.5,
            width: Platform.OS === "ios" ? vw / 3.8 : vw / 4.4,
            height: vh / 25,
            borderRadius: vh / 25,
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: vw / 25,
            alignItems: "center",
            backgroundColor: placeFilterChecked ? "#1e201f" : "white",
            marginRight: vw / 20
          }}
          onPress={placeModalOpen}
        >
          <Text style={{ color: placeFilterChecked ? "white" : "black" }}>
            거래 장소
          </Text>
          <IonIcon
            name="chevron-down"
            size={20}
            style={{ color: placeFilterChecked ? "white" : "black" }}
          />
        </Pressable>
        <Pressable
          style={{
            borderWidth: 0.5,
            width: Platform.OS === "ios" ? vw / 3.8 : vw / 4.4,
            height: vh / 25,
            borderRadius: vh / 25,
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: vw / 25,
            alignItems: "center",
            backgroundColor: categoryFilterChecked ? "#1e201f" : "white"
          }}
          onPress={categoryModalOpen}
        >
          <Text style={{ color: categoryFilterChecked ? "white" : "black" }}>
            카테고리
          </Text>
          <IonIcon
            name="chevron-down"
            size={20}
            style={{ color: categoryFilterChecked ? "white" : "black" }}
          />
        </Pressable>
        <Pressable
          style={{
            borderWidth: 0.5,
            width: Platform.OS === "ios" ? vw / 3.8 : vw / 4.4,
            height: vh / 25,
            borderRadius: vh / 25,
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: vw / 25,
            alignItems: "center",
            backgroundColor: departmentFilterChecked ? "#1e201f" : "white",
            marginLeft: vw / 20
          }}
          onPress={departmentModalOpen}
        >
          <Text style={{ color: departmentFilterChecked ? "white" : "black" }}>
            학부별
          </Text>
          <IonIcon
            name="chevron-down"
            size={20}
            style={{ color: departmentFilterChecked ? "white" : "black" }}
          />
        </Pressable>
      </View>
      {isLoaded ? (
        <View
          style={{
            width: vw,
            height:
              vh -
              vh / 17.5 -
              vh / 20 -
              vh / 11 -
              vh / 90 -
              vh / 77 -
              insets.top
          }}
        >
          <FlatList
            data={results}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  backgroundColor: "#727272",
                  opacity: 0.4,
                  height: 0.34
                }}
              />
            )}
          />
        </View>
      ) : (
        <View
          style={{
            height: vh - vh / 20 - vh / 11 - vh / 17.5 - insets.top,
            width: vw,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#e1e1e1", fontSize: 20, fontWeight: "bold" }}>
            검색중입니다. 잠시만 기다려주십시오.
          </Text>
        </View>
      )}
      <BottomTabs navigation={navigation} screen="Search" />
    </SafeAreaView>
  );
}

const sortModalStyles = StyleSheet.create({
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

const placeFilterModalStyles = StyleSheet.create({
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
    height: vh / 1.65,
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

const categoryFilterModalStyles = StyleSheet.create({
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
    height: vh / 1.65,
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

const departmentFilterModalStyles = StyleSheet.create({
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
    height: vh / 1.65,
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
  searchWordBar: {
    backgroundColor: "#f0f0f0",
    borderRadius: 100,
    height: vh / 20,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  }
});

export default SearchResultScreen;
