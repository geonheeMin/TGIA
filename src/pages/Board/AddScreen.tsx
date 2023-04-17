import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState, useEffect } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { launchImageLibrary } from "react-native-image-picker";
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Dimensions,
  Alert,
  Image,
  PixelRatio,
  Modal
} from "react-native";
import api from "../../api";
import useStore from "../../../store";
import cancel from "../../assets/design/backIcon.png";
import nextIcon from "../../assets/design/nextIcon.png";
import gallery from "../../assets/design/camera.png";
import Axios from "axios";
import { categories } from "../../assets/data/category";
import { places } from "../../assets/data/place";
import { tracks } from "../../assets/data/track";

type RootStackParamList = {
  Add: undefined;
};
type AddScreenProps = NativeStackScreenProps<RootStackParamList, "Add">;

interface Board {
  post_id: number;
  title: string;
  category: string;
  text: string;
  member_id: string;
  date: string;
  price: number;
  place: string;
  track: string;
  img: string;
  department: string;
}

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function AddScreen({ route, navigation }: AddScreenProps) {
  const params = route.params;
  const { session, url } = useStore(); //작성자 id
  const board = params?.board ? params.board : "new"; //새 글 작성 or 기존 글 수정 판단
  const [title, setTitle] = useState(""); //게시글 제목
  const [category, setCategory] = useState(""); //게시글 카테고리
  const [text, setText] = useState(""); //게시글 내용
  const [time, setTime] = useState(""); //게시글 작성 시간
  const [img, setImg] = useState({}); //게시글 이미지
  const [filename, setFilename] = useState();
  const [price, setPrice] = useState<number | null>(); //게시글 가격
  const [free, setFree] = useState(false); //게시글 나눔 확인(true or false)
  const [place, setPlace] = useState(""); //게시글 거래 장소
  const [track, setTrack] = useState(""); //게시글 표시 트랙
  /** 모달 창 표시 true false 변수 */
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [placeVisible, setPlaceVisible] = useState(false);
  const [trackVisible, setTrackVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); //모달 open시 배경 어둡게 하기 위한 state

  const [isCategoryRecommended, setIsCategoryRecommended] = useState(false);
  const [testResult, setTestResult] = useState("");

  const images = [];
  const formData = new FormData(); //서버로 전송할 데이터 공간

  var date = new Date();
  var postTime = new Intl.DateTimeFormat("locale", {
    dateStyle: "long",
    timeStyle: "medium"
  }).format(date);

  function renderScreen() {
    if (board !== "new") {
      setTitle(board.title);
      setCategory(board.category);
      setText(board.text);
      setPrice(board.price);
      setFree(board.free);
      setPlace(board.place);
      setTrack(board.track);
      setTime(board.date);
      setIsCategoryRecommended(!isCategoryRecommended);
    } else {
      setTime(postTime);
    }
  }

  function AddButton() {
    if (postButton === "등록") {
      Alert.alert("게시글 등록", "게시글을 등록하시겠습니까?", [
        { text: "취소", style: "cancel" },
        { text: "등록", onPress: postAdd }
      ]);
    } else {
      Alert.alert("게시글 수정", "게시글을 수정하시겠습니까?", [
        { text: "취소", style: "cancel" },
        { text: "수정", onPress: postUpdate }
      ]);
    }
  }

  function CancelButton() {
    Alert.alert("게시글 취소", "취소하시겠습니까?", [
      { text: "예", onPress: toList },
      { text: "아니요", style: "cancel" }
    ]);
  }

  /** 새 글 작성시 호출되는 함수 */
  function postAdd() {
    const request = {
      title: title,
      user_id: session.member_id,
      category: category,
      content: text,
      price: price,
      images: filename
    };

    Axios.post(`${url}/post/insert`, request, {
      headers: { "text-Type": "application/json" }
    })
      .then((res) => {
        console.log("전송");
        navigation.navigate("List");
      })
      .catch((error) => {
        console.log(error);
        console.log(title);
        console.log(category);
        console.log(text);
        console.log(isNaN(price));
        console.log(isNaN(session.member_id));
      });
    // const post: Board = {
    //   title: title,
    //   category: category,
    //   text: text,
    //   user: id,
    //   date: time,
    //   price: parseInt(price),
    //   place: place,
    //   track: track,
    //   img: img.uri,
    // };
    // formData.append('post', post); //게시글 객체
    // formData.append('image', {
    //   uri: img.uri, //이미지 uri
    //   type: img.type, //이미지 타입(image/jpeg)
    //   name: img.fileName //이미지 파일 이름
    // })
    // Axios.post('api', formData, {headers: {'text-Type': 'multipart/form-data',},});
    // console.log(JSON.stringify(formData));

    //toList();
  }

  /** 기존 글 수정시 호출되는 함수 */
  function postUpdate() {
    // Axios.get('http://localhost:8080/api/update', {
    //   params: {
    //     title: title,
    //     user: id,
    //     category: category,
    //     text: text,
    //     date: time,
    //   },
    // });
    // board.title = title;
    // board.id = id;
    // board.category = category;
    // board.text = text;
    // board.date = time;
    const request = {
      id: board.post_id,
      price: price,
      title: title,
      content: text,
      departmentType: board.department,
      image_id: 1,
      locationType: board.locationType,
      location_text: board.location_text,
      item_name: board.item_name
    };
    console.log(request);
    Axios.put(`${url}/post/edit`, request, {
      headers: { "text-Type": "application/json" }
    }).then((res) => navigation.replace("List"));
    afterUpdate();
  }

  /** 새 글 작성 후 목록으로 돌아가는 함수 */
  const toList = useCallback(() => {
    navigation.navigate("List");
  }, [navigation]);

  /** 기존 글 수정 후 상세 화면으로 돌아가는 함수 */
  const afterUpdate = useCallback(() => {
    navigation.navigate("Detail", { board: board });
  }, [board, navigation]);

  const getCategoryRecommend = () => {
    Axios.get(`${url}/send-data`)
      .then((res) => {
        if (res.data !== "null") {
          console.log(res.data);
          setCategory(res.data);
          setIsCategoryRecommended(!isCategoryRecommended);
        } else {
          setTimeout(() => getCategoryRecommend(), 1000);
        }
      })
      .catch((error) => console.log(error));
  };

  /** 갤러리에서 이미지 선택하는 함수 */
  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo", selectionLimit: 10 }, (res) => {
      if (res.didCancel) {
        console.log("Canceled");
      } else if (res.errorCode) {
        console.log("Errored");
      } else {
        console.log(res);
        const formData = new FormData();
        res.assets.forEach((asset) => {
          images.push({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName
          });
          console.log(images);
        });
        images.forEach((image, index) => {
          formData.append(`images`, {
            index: index,
            uri: image.uri,
            type: image.type,
            name: image.name
          });
        });
        // formData.append("images", {
        //   uri: res.assets[0].uri,
        //   type: res.assets[0].type,
        //   name: res.assets[0].fileName
        // });
        Axios.post(`${url}/image/send_images`, formData, {
          headers: {
            "Text-Type": "multipart/form-data"
          }
        })
          .then((res) => {
            setFilename(res.data);
            setTimeout(() => getCategoryRecommend(), 3000);
          })
          .catch((error) => console.log(error));
        setImg(res.assets[0]);
      }
    });
  };

  /** 카테고리 모달 관리 함수
   * showCategory : 선택한 카테고리를 한글로 출력하는 함수
   * categoryModalControl : 카테고리 모달 open/close 관리 함수
   * CategoryModal : 카테고리 모달 컴포넌트 함수
   */
  const showCategory = (selected: string) => {
    const selection = categories.filter((item) => item.value === selected);
    return selection[0].label;
  };
  const categoryModalControl = () => {
    setModalOpen(!modalOpen);
    setCategoryVisible(!categoryVisible);
  };
  const CategoryModal = () => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={categoryVisible}
        onRequestClose={() => categoryModalControl()}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
            zIndex: categoryVisible ? 52 : 0
          }}
          onPress={() => categoryModalControl()}
        />
        <View
          style={
            categoryVisible ? styles.categoryModalO : styles.categoryModalX
          }
        >
          <FlatList
            data={categories}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={(item) => {
              return (
                <Pressable
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(item.item.value);
                    categoryModalControl();
                  }}
                >
                  <Text>{item.item.label}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  /** 거래 장소 모달 관리 함수 */
  // const showPlace = (selected: string) => {
  //   const selection = places.filter((item) => item.value === selected);
  //   return selection[0].label;
  // };
  const placeModalControl = () => {
    setModalOpen(!modalOpen);
    setPlaceVisible(!placeVisible);
  };
  const PlaceModal = () => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={placeVisible}
        onRequestClose={() => placeModalControl()}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
            zIndex: placeVisible ? 52 : 0
          }}
          onPress={() => placeModalControl()}
        />
        <View style={placeVisible ? styles.placeModalO : styles.placeModalX}>
          <FlatList
            data={places}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={(item) => {
              return (
                <Pressable
                  style={styles.placeItem}
                  onPress={() => {
                    setPlace(item.item.value);
                    placeModalControl();
                  }}
                >
                  <Text>{item.item.label}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  /** 거래 장소 모달 관리 함수 */
  // const showTrack = (selected: string) => {
  //   const selection = tracks.filter((item) => item.value === selected);
  //   return selection[0].label;
  // };
  const trackModalControl = () => {
    setModalOpen(!modalOpen);
    setTrackVisible(!trackVisible);
  };
  const TrackModal = () => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={trackVisible}
        onRequestClose={() => trackModalControl()}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
            zIndex: trackVisible ? 52 : 0
          }}
          onPress={() => trackModalControl()}
        />
        <View style={trackVisible ? styles.trackModalO : styles.trackModalX}>
          <FlatList
            data={tracks}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={(item) => {
              return (
                <Pressable
                  style={styles.trackItem}
                  onPress={() => {
                    setTrack(item.item.value);
                    trackModalControl();
                  }}
                >
                  <Text>{item.item.label}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    renderScreen();
  }, []);

  useEffect(() => {
    free ? setPrice(0) : setPrice(board.price);
  }, [free]);

  return (
    <SafeAreaView style={styles.background}>
      <CategoryModal />
      <PlaceModal />
      <TrackModal />
      <View
        style={{
          position: "absolute",
          width: vw,
          height: vh,
          backgroundColor: "black",
          zIndex: modalOpen ? 50 : -50,
          opacity: modalOpen ? 0.5 : 0
        }}
      ></View>
      <View style={styles.topBar}>
        <Pressable style={styles.cancelButton} onPress={toList}>
          <Image source={cancel} style={styles.cancelIcon} />
          <Text style={{ marginLeft: 15, fontWeight: "bold", fontSize: 20 }}>
            글쓰기
          </Text>
        </Pressable>
        <Pressable
          style={styles.postButton}
          onPress={board === "new" ? postAdd : postUpdate}
        >
          <Text style={{ color: "#0d44fe", fontSize: 18, fontWeight: "600" }}>
            {board === "new" ? "등록" : "수정"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.galleryBar}>
        <Pressable style={styles.galleryButton} onPress={pickImage}>
          <Image source={gallery} style={styles.galleryIcon} />
        </Pressable>
        <Image
          source={
            Object.keys(img).length === 0
              ? { uri: board.img }
              : { uri: img?.uri }
          }
          style={styles.selectImgIcon}
        />
      </View>
      <View style={styles.titleBar}>
        <TextInput
          placeholder={"제목"}
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={styles.categoryBar}>
        <Pressable
          style={styles.categoryButton}
          disabled={!isCategoryRecommended}
          onPress={() => {
            categoryModalControl();
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: isCategoryRecommended ? "black" : "grey"
            }}
          >
            {board !== "new"
              ? category
              : !isCategoryRecommended
              ? "카테고리 선택"
              : category}
          </Text>
          <Image source={nextIcon} style={styles.nextIcon} />
        </Pressable>
      </View>
      <View style={styles.priceBar}>
        <TextInput
          value={price?.toString()}
          placeholder={"₩ 가격"}
          keyboardType="number-pad"
          style={styles.priceInput}
          onChange={(e) =>
            e.nativeEvent.text === ""
              ? setPrice(null)
              : setPrice(parseInt(e.nativeEvent.text))
          }
        />
        <Text
          style={{
            marginLeft: 20,
            marginRight: 5,
            opacity: price === null ? 0 : 100
          }}
        >
          원
        </Text>
        <BouncyCheckbox
          style={styles.freeButton}
          onPress={() => setFree(!free)}
          fillColor={"#008bfd"}
          iconStyle={styles.freeButton}
          innerIconStyle={styles.freeButton}
        />
        <Text style={{ marginLeft: 10 }}>나눔</Text>
      </View>
      <View style={styles.textBar}>
        <TextInput
          multiline={true}
          style={styles.textInput}
          placeholder={"내용을 입력해주세요"}
          value={text}
          onChangeText={setText}
        />
      </View>
      <View style={styles.placeBar}>
        <Text style={{ flex: 2, marginLeft: 5 }}>거래 희망 장소</Text>
        <Pressable
          style={styles.placeButton}
          onPress={() => placeModalControl()}
        >
          <Text
            style={{
              marginRight: 35,
              textAlign: "right",
              width: vw / 2.12,
              color: "grey"
            }}
          >
            {/* {place === "" ? "장소 선택" : showPlace(place)} */}
            {place === "" ? "장소 선택" : board.locationType}
          </Text>
          <Image source={nextIcon} style={styles.nextIcon} />
        </Pressable>
      </View>
      <View style={styles.trackBar}>
        <Text style={{ flex: 2, marginLeft: 5 }}>보여줄 트랙 설정</Text>
        <Pressable
          style={styles.trackButton}
          onPress={() => trackModalControl()}
        >
          <Text
            style={{
              fontSize: 15,
              marginRight: 35,
              textAlign: "right",
              width: vw / 2.12,
              color: "grey"
            }}
          >
            {/* {track === "" ? "" : showTrack(track)} */}
            {track === "" ? "" : board.department}
          </Text>
          <Image source={nextIcon} style={styles.nextIcon} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    width: vw,
    height: vh,
    backgroundColor: "white"
  },
  backgroundModal: {
    width: vw,
    height: vh,
    backgroundColor: "black"
  },
  topBar: {
    borderBottomWidth: 0.2,
    height: vh / 20,
    flexDirection: "row",
    alignItems: "center"
  },
  cancelButton: {
    paddingLeft: vw / 35,
    flexDirection: "row",
    alignItems: "center",
    height: vh / 17.5,
    flex: 1
  },
  cancelIcon: {
    width: 35 / 2.3,
    height: 53 / 2.3,
    overflow: "visible"
  },
  postButton: {
    flexDirection: "row",
    flex: 0.2,
    alignItems: "center",
    justifytext: "center",
    paddingRight: 3,
    height: vh / 17.5
  },
  galleryBar: {
    height: vh / 8.75,
    borderBottomWidth: 0.2,
    borderBottomColor: "#e9e9e9",
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  galleryButton: {
    backgroundColor: "#eeeeee",
    flexDirection: "row",
    justifytext: "center",
    alignItems: "center",
    paddingLeft: vw / 25,
    borderWidth: 1,
    borderRadius: 7,
    width: vw / 4.5,
    height: vh / 10
  },
  galleryIcon: {
    width: 782 / 15,
    height: 608 / 15
  },
  selectImgIcon: {
    flexDirection: "row",
    justifytext: "center",
    alignItems: "center",
    marginLeft: 20,
    borderWidth: 1,
    borderRadius: 7,
    width: vw / 4.5,
    height: vh / 10
  },
  titleBar: {
    height: vh / 14,
    borderBottomWidth: 0.2,
    borderBottomColor: "#e9e9e9",
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  titleInput: {
    fontSize: 17.5,
    width: vw - vw / 20,
    paddingLeft: 5
  },
  categoryBar: {
    height: vh / 14,
    borderBottomWidth: 0.2,
    borderBottomColor: "#e9e9e9",
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  categoryButton: {
    paddingLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    width: vw - vw / 20,
    height: vh / 15.5
  },
  nextIcon: {
    position: "absolute",
    right: 10,
    width: 35 / 2.3,
    height: 53 / 2.3,
    overflow: "visible"
  },
  priceBar: {
    height: vh / 16,
    borderBottomWidth: 0.2,
    borderBottomColor: "#e9e9e9",
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  priceInput: {
    fontSize: 13,
    paddingLeft: 5,
    width: vw - vw / 3,
    height: vh / 20
  },
  freeButton: {
    borderRadius: 15 / PixelRatio.get(),
    width: vh / 32.5,
    height: vh / 32.5,
    marginLeft: 5
  },
  textBar: {
    height: vh / 3.8,
    borderBottomWidth: 8.5,
    borderBottomColor: "#e9e9e9",
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  textInput: {
    justifytext: "center",
    alignSelf: "flex-start",
    width: vw - vw / 12.5,
    height: vh / 4.5
  },
  placeBar: {
    height: vh / 16,
    borderBottomWidth: 0.2,
    borderBottomColor: "#e9e9e9",
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  placeButton: {
    height: vh / 22,
    flexDirection: "row",
    justifytext: "center",
    alignItems: "center",
    flex: 3
  },
  trackBar: {
    height: vh / 16,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  trackButton: {
    height: vh / 22,
    flexDirection: "row",
    justifytext: "center",
    alignItems: "center",
    flex: 3
  },
  /** 모달 관련 style */
  separator: {
    backgroundColor: "#777777",
    height: 0.34
  },
  /** 카테고리 모달 style
   * categoryModalO : 카테고리 모달이 on 일 때
   * categoryModalX : 카테고리 모달이 off 일 때
   * categoryItem : FlatList 로 카테고리를 목록으로 만들 때 각각의 style
   */
  categoryModalO: {
    position: "absolute",
    borderWidth: 1,
    left: vw * 0.05,
    top: vh * 0.13,
    backgroundColor: "#FFFFFF",
    zIndex: 53
  },
  categoryModalX: {
    position: "absolute",
    borderWidth: 1,
    left: 100,
    top: 250,
    backgroundColor: "#FFFFFF",
    zIndex: 0
  },
  categoryItem: {
    width: vw - vw / 10,
    height: (vh * 0.6) / 7,
    justifytext: "center",
    paddingLeft: vw / 20
  },
  /** 거래 장소 모달 style
   * placeModalO : 카테고리 모달이 on 일 때
   * placeModalX : 카테고리 모달이 off 일 때
   * placeItem : FlatList 로 카테고리를 목록으로 만들 때 각각의 style
   */
  placeModalO: {
    position: "absolute",
    borderWidth: 1,
    left: vw * 0.05,
    top: vh * 0.08,
    backgroundColor: "#FFFFFF",
    zIndex: 53
  },
  placeModalX: {
    position: "absolute",
    borderWidth: 1,
    left: 100,
    top: 250,
    backgroundColor: "#FFFFFF",
    zIndex: 0
  },
  placeItem: {
    width: vw - vw / 10,
    height: (vh * 0.75) / 14,
    justifytext: "center",
    paddingLeft: vw / 20
  },
  /** 트랙 표시 모달 style
   * trackModalO : 카테고리 모달이 on 일 때
   * trackModalX : 카테고리 모달이 off 일 때
   * trackItem : FlatList 로 카테고리를 목록으로 만들 때 각각의 style
   */
  trackModalO: {
    position: "absolute",
    borderWidth: 1,
    left: vw * 0.05,
    top: vh * 0.1,
    backgroundColor: "#FFFFFF",
    zIndex: 53
  },
  trackModalX: {
    position: "absolute",
    borderWidth: 1,
    left: 100,
    top: 250,
    backgroundColor: "#FFFFFF",
    zIndex: 0
  },
  trackItem: {
    width: vw - vw / 10,
    height: (vh * 0.75) / 14,
    justifytext: "center",
    paddingLeft: vw / 20
  }
});

export default AddScreen;
