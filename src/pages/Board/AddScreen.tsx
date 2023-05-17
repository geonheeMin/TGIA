import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState, useEffect, useRef } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
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
  Modal,
  PermissionsAndroid,
  ImageBackground,
  Keyboard,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import api from "../../api";
import useStore from "../../../store";
import IonIcon from "react-native-vector-icons/Ionicons";
import cancel from "../../assets/design/backIcon.png";
import nextIcon from "../../assets/design/nextIcon.png";
import gallery from "../../assets/design/camera.png";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Axios from "axios";
import { categories } from "../../assets/data/category";
import { places } from "../../assets/data/place";
import { tracks } from "../../assets/data/track";
import { Post } from "../../types/PostType";

type RootStackParamList = {
  Add: undefined;
};
type AddScreenProps = NativeStackScreenProps<RootStackParamList, "Add">;

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

function AddScreen({ route, navigation }: AddScreenProps) {
  const params = route.params;
  const { session, url } = useStore(); //작성자 id
  const board = params?.board ? params.board : "new"; //새 글 작성 or 기존 글 수정 판단
  const [postButton, setPostButton] = useState(
    board === "new" ? "등록" : "수정"
  );
  const [title, setTitle] = useState(""); //게시글 제목
  const [category, setCategory] = useState(""); //게시글 카테고리
  const [text, setText] = useState(""); //게시글 내용
  const [time, setTime] = useState(""); //게시글 작성 시간
  const [images, setImages] = useState([]); //게시글 이미지
  const [sendImages, setSendImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filename, setFilename] = useState();
  const [price, setPrice] = useState<number | null>(); //게시글 가격
  const [free, setFree] = useState(false); //게시글 나눔 확인(true or false)
  const [place, setPlace] = useState(""); //게시글 거래 장소
  const [track, setTrack] = useState(""); //게시글 표시 트랙
  const [department, setDepartment] = useState("");
  /** 모달 창 표시 true false 변수 */
  const [imageVisible, setImageVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [placeVisible, setPlaceVisible] = useState(false);
  const [trackVisible, setTrackVisible] = useState(false);
  //const [item_name, setItem_name] = useState("");
  const [trackWord, setTrackWord] = useState("");
  const [modalOpen, setModalOpen] = useState(false); //모달 open시 배경 어둡게 하기 위한 state

  const [isCategoryRecommended, setIsCategoryRecommended] = useState(false);

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
      setDepartment(board.department);
      board.images.map((item) => {
        images.push({ image: `${url}/images/${item}`, boardImage: true });
      });
      setIsCategoryRecommended(!isCategoryRecommended);
    } else {
      setTime(postTime);
    }
  }

  const formCheck = () => {
    if (title === "") return false;
    if (category === "") return false;
    if (images.length === 0) return false;
    if (text === "") return false;
    if (price === null) return false;
    if (place === "") return false;
    if (department === "") return false;
    if (track === "") return false;
    //if (item_name === "") return false;
    return true;
  };

  function AddButton() {
    if (formCheck()) {
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
    } else {
      Alert.alert("게시글을 정확히 입력해주십시오.", {
        text: "취소",
        style: "cancel"
      });
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
      images: filename,
      track: track,
      department: department,
      locationType: place,
      item_name: board.item_name
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
      track: track,
      department: department,
      image_id: 1,
      locationType: board.locationType,
      item_name: board.item_name,
      statusType: board.statusType
    };
    console.log(request);
    Axios.put(`${url}/post/edit`, request, {
      headers: { "text-Type": "application/json" }
    }).then((res) =>
      //navigation.replace("Detail", { board: res.data })
      {
        console.log(res.data);
      }
    );
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
          setCategory(res.data);
          setIsCategoryRecommended(!isCategoryRecommended);
        } else {
          setTimeout(() => getCategoryRecommend(), 2000);
        }
      })
      .catch((error) => console.log(error));
  };

  /** 이미지 모달 관리 함수 */
  const imageModalControl = () => {
    setModalOpen(!modalOpen);
    setImageVisible(!imageVisible);
  };
  const ImageModal = () => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={imageVisible}
        onRequestClose={() => imageModalControl()}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
            zIndex: placeVisible ? 52 : 0
          }}
          onPress={() => imageModalControl()}
        />
        <View style={imageVisible ? styles.imageModalO : styles.imageModalX}>
          <Pressable
            style={styles.imageButton}
            onPress={() => {
              shootImage();
              imageModalControl();
            }}
          >
            <MaterialCommunityIcons
              name="camera"
              size={23}
              style={styles.imageButtonIcon}
            />
            <Text style={styles.imageButtonText}>카메라로 촬영하기</Text>
          </Pressable>
          <Pressable
            style={styles.imageButton}
            onPress={() => {
              pickImage();
              imageModalControl();
            }}
          >
            <MaterialCommunityIcons
              name="image"
              size={23}
              style={styles.imageButtonIcon}
            />
            <Text style={styles.imageButtonText}>사진 선택하기</Text>
          </Pressable>
          <Pressable style={styles.imageButton} onPress={imageModalControl}>
            <MaterialCommunityIcons
              name="cancel"
              size={23}
              style={styles.imageButtonIcon}
            />
            <Text style={styles.imageButtonText}>취소</Text>
          </Pressable>
        </View>
      </Modal>
    );
  };

  const shootImage = async () => {
    let launchFunction = null;

    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "App Camera Permission",
            message: "App needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        const grantedGallery = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "App Gallery Permission",
            message: "App needs access to your photos",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (
          granted === PermissionsAndroid.RESULTS.GRANTED &&
          grantedGallery === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("Camera permission given");

          launchCamera({ mediaType: "photo", saveToPhotos: true }, (res) => {
            if (res.didCancel) {
              console.log("Canceled");
            } else if (res.errorCode) {
              console.log("Errored");
              console.log(res.errorCode);
            } else {
              const photo = res.assets[0]?.uri;
              if (!photo || photo.length === 0) {
                Alert.alert("photo is empty");
                return;
              }
              CameraRoll.save(photo, "photo")
                .then(() => {
                  pickImage();
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          });
        } else {
          console.log("Camera permission denied");
        }
      } catch (e) {
        console.warn(e);
      }
    } else {
      // ios일 경우
      const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
      const photoStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (cameraStatus === RESULTS.GRANTED) {
        console.log("Camera permission given");
        launchFunction = launchCamera;
      } else {
        console.log("Camera permission denied");
        return;
      }

      if (launchFunction) {
        launchCamera({ mediaType: "photo", saveToPhotos: true }, (res) => {
          if (res.didCancel) {
            console.log("Canceled");
          } else if (res.errorCode) {
            console.log("Errored");
            console.log("launchCamera" + res.errorCode);
          } else {
            const photo = res.assets[0]?.uri;
            if (!photo || photo.length === 0) {
              Alert.alert("photo is empty");
              return;
            }
            CameraRoll.save(photo, "photo")
              .then(() => {
                pickImage();
              })
              .catch((e) => {
                console.log(e);
              });
          }
        });
      }
    }
  };

  /** 갤러리에서 이미지 선택하는 함수 */
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 10
      },
      (res) => {
        if (res.didCancel) {
          console.log("Canceled");
        } else if (res.errorCode) {
          console.log("Errored");
        } else {
          const formData = new FormData();
          res.assets?.forEach((asset) => {
            if (images.length > 0) {
              setImages([...images, { image: asset.uri, boardImage: false }]);
            } else {
              images.push({ image: asset.uri, boardImage: false });
            }
            sendImages.push({
              uri: asset.uri,
              type: asset.type,
              name: asset.fileName
            });
          });
          sendImages.map((image, index) => {
            formData.append(`images`, {
              index: index,
              uri: image.uri,
              type: image.type,
              name: image.name
            });
          });
          Axios.post(`${url}/image/send_images`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
            .then((res) => {
              if (!isCategoryRecommended) {
                setFilename(res.data);
                setTimeout(() => getCategoryRecommend(), 3000);
              } else {
                setFilename(res.data);
              }
            })
            .catch((error) => console.log("wf"));
        }
      }
    );
  };

  const renderImages = (item) => {
    const deleteImage = () => {
      const newImages = images.filter((image) => image !== item.item);
      const newSendImages = sendImages.filter(
        (image) => image.uri !== item.item.image
      );
      setImages(newImages);
      setSendImages(newSendImages);
    };
    return (
      <ImageBackground
        source={{ uri: item.item.image }}
        style={[
          styles.selectedImgIcon,
          { alignItems: "flex-start", justifyContent: "flex-end" }
        ]}
      >
        <Pressable
          style={{
            width: 25,
            height: 25,
            borderRadius: 25,
            backgroundColor: "lightgrey",
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => deleteImage()}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
        </Pressable>
      </ImageBackground>
    );
  };

  /** 카테고리 모달 관리 함수
   * showCategory : 선택한 카테고리를 한글로 출력하는 함수
   * categoryModalControl : 카테고리 모달 open/close 관리 함수
   * CategoryModal : 카테고리 모달 컴포넌트 함수
   */
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
          {}
          <FlatList
            data={categories}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={(item) => {
              return (
                <Pressable
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(item.item);
                    categoryModalControl();
                  }}
                >
                  <Text>{item.item}</Text>
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
                    setPlace(item.item);
                    placeModalControl();
                  }}
                >
                  <Text>{item.item}</Text>
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
  const TrackPageControl = () => {
    setModalOpen(!modalOpen);
    setTrackVisible(!trackVisible);
  };
  const collegeList = [...new Set(tracks.map((item) => item.college))];
  const renderTrackList = (department: string) => {
    const trackList = [
      ...new Set(
        tracks
          .filter((item) => item.department === department)
          .map((item) => item.track)
      )
    ];
    return (
      <FlatList
        data={trackList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={(item) => {
          return (
            <Pressable
              style={styles.trackItem}
              onPress={() => {
                setTrack(item.item);
                setDepartment(department);
                TrackPageControl();
              }}
            >
              <Text>{item.item}</Text>
            </Pressable>
          );
        }}
      />
    );
  };
  const renderDepartmentList = (college: string) => {
    const departmentList = [
      ...new Set(
        tracks
          .filter((item) => item.college === college)
          .map((item) => item.department)
      )
    ];
    return (
      <FlatList
        data={departmentList}
        renderItem={(item) => {
          return (
            <View>
              <View style={styles.separator} />
              <View style={styles.departmentItem}>
                <Text
                  style={{ color: "#267dfd", fontSize: 16, fontWeight: "bold" }}
                >
                  {item.item}
                </Text>
              </View>
              <View style={styles.separator} />
              {renderTrackList(item.item)}
            </View>
          );
        }}
      />
    );
  };
  const renderCollege = () => {
    return (
      <FlatList
        data={collegeList}
        renderItem={(item) => {
          return (
            <View>
              <View style={styles.collegeItem}>
                <Text
                  style={{ color: "#134bff", fontSize: 18, fontWeight: "bold" }}
                >
                  {item.item}
                </Text>
              </View>
              {renderDepartmentList(item.item)}
            </View>
          );
        }}
      />
    );
  };
  const TrackPage = () => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={trackVisible}
        onRequestClose={TrackPageControl}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
            zIndex: trackVisible ? 52 : 0
          }}
          onPress={TrackPageControl}
        />
        <View style={trackVisible ? styles.TrackPageO : styles.TrackPageX}>
          <View
            style={{
              height: vh / 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: vw / 50
            }}
          >
            <Pressable
              style={{ position: "absolute", left: vw / 50 }}
              onPress={TrackPageControl}
            >
              <IonIcon name={"md-close-sharp"} size={20} />
            </Pressable>
            <Text style={{ fontWeight: "bold" }}>트랙 설정</Text>
          </View>
          <View style={styles.separator} />
          {renderCollege()}
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.background}>
        <ImageModal />
        <CategoryModal />
        <PlaceModal />
        <TrackPage />
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
        <View style={styles.topBar} removeClippedSubviews={true}>
          <Pressable style={styles.cancelButton} onPress={CancelButton}>
            <IonIcon name={"chevron-back-sharp"} size={25} />
            <Text style={{ marginLeft: 5, fontWeight: "bold", fontSize: 20 }}>
              글쓰기
            </Text>
          </Pressable>
          <Pressable style={styles.postButton} onPress={AddButton}>
            <Text style={{ color: "#0d44fe", fontSize: 18, fontWeight: "600" }}>
              {board === "new" ? "등록" : "수정"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.galleryBar}>
          <Pressable style={styles.galleryButton} onPress={imageModalControl}>
            <View
              style={{
                flex: 3,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image source={gallery} style={styles.galleryIcon} />
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1
              }}
            >
              <Text
                style={
                  images.length === 0
                    ? { color: "black" }
                    : { color: "#c39c00" }
                }
              >
                {images.length}
              </Text>
              <Text> / 10</Text>
            </View>
          </Pressable>
          {images.length === 0 ? (
            <View style={styles.selectImgIcon} />
          ) : (
            <FlatList
              horizontal={true}
              data={images}
              renderItem={renderImages}
              showsHorizontalScrollIndicator={false}
              style={{ marginLeft: 20 }}
              refreshing={refreshing}
              keyExtractor={(item) => item.image}
              extraData={images}
            />
          )}
        </View>
        <View style={styles.titleBar}>
          <TextInput
            placeholder={"제목"}
            placeholderTextColor={"lightgrey"}
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.categoryBar}>
          <Pressable
            style={styles.categoryButton}
            //disabled={!isCategoryRecommended}
            onPress={() => {
              categoryModalControl();
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: isCategoryRecommended ? "black" : "lightgrey"
              }}
            >
              {board !== "new"
                ? category
                : !isCategoryRecommended
                ? "카테고리 선택"
                : category}
            </Text>
            <IonIcon
              name={"chevron-forward-sharp"}
              size={20}
              style={styles.nextIcon}
            />
          </Pressable>
        </View>
        <View style={styles.priceBar}>
          <TextInput
            value={price?.toString()}
            placeholder={"₩ 가격"}
            placeholderTextColor={"lightgrey"}
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
          <Text style={{ marginLeft: vw / 25 }}>나눔</Text>
        </View>

        <View style={styles.textBar}>
          <TextInput
            multiline={true}
            style={styles.textInput}
            placeholder={"내용을 입력해주세요"}
            placeholderTextColor={"lightgrey"}
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
                color: "lightgrey"
              }}
            >
              {/* {place === "" ? "장소 선택" : showPlace(place)} */}
              {place === "" ? "장소 선택" : place}
            </Text>
            <IonIcon
              name={"chevron-forward-sharp"}
              size={20}
              style={styles.nextIcon}
            />
          </Pressable>
        </View>
        <View style={styles.trackBar}>
          <Text style={{ flex: 2, marginLeft: 5 }}>보여줄 트랙 설정</Text>
          <Pressable
            style={styles.trackButton}
            onPress={() => TrackPageControl()}
          >
            <Text
              style={{
                fontSize: 15,
                marginRight: 35,
                textAlign: "right",
                width: vw / 2.12,
                color: "lightgrey"
              }}
            >
              {/* {track === "" ? "" : showTrack(track)} */}
              {track === "" ? "트랙 선택" : track}
            </Text>
            <IonIcon
              name={"chevron-forward-sharp"}
              size={20}
              style={styles.nextIcon}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    height: Platform.OS === "ios" ? vh / 20 : vh / 15,
    flexDirection: "row",
    alignItems: "center"
  },
  cancelButton: {
    paddingLeft: vw / 35,
    flexDirection: "row",
    alignItems: "center",
    height: vh / 17.5
  },
  cancelIcon: {
    width: 35 / 2.3,
    height: 53 / 2.3,
    overflow: "visible"
  },
  postButton: {
    position: "absolute",
    right: vw / 25,
    flexDirection: "row",
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    width: vh / 10,
    height: vh / 10
  },
  galleryIcon: {
    width: 782 / 20,
    height: 608 / 20
  },
  selectImgIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    borderWidth: 1,
    borderRadius: 7,
    width: vh / 10,
    height: vh / 10
  },
  selectedImgIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderWidth: 1,
    borderRadius: 7,
    width: vh / 10,
    height: vh / 10,
    overflow: "hidden"
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
    paddingLeft: 5,
    color: "black"
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
    height: vh / 20,
    color: "black"
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
    justifyContent: "center",
    alignSelf: "flex-start",
    width: vw - vw / 12.5,
    height: vh / 4.5,
    textAlignVertical: "top",
    color: "black"
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
    justifyContent: "center",
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
    justifyContent: "center",
    alignItems: "center",
    flex: 3
  },
  /** 모달 관련 style */
  separator: {
    backgroundColor: "#777777",
    height: 0.34
  },
  /** 이미지 모달 style
   * imageModalO : 이미지 모달이 on 일 때
   * imageModalX : 이미지 모달이 off 일 때
   * imageItem : 이미지 버튼 style
   * imageButtonText : 이미지 버튼 글자 style
   */
  imageModalO: {
    position: "absolute",
    borderWidth: 1,
    left: vw * 0.025,
    top: vh * 0.112,
    backgroundColor: "#FFFFFF",
    zIndex: 53,
    borderRadius: 10
  },
  imageModalX: {
    position: "absolute",
    borderWidth: 1,
    left: 100,
    top: 250,
    backgroundColor: "#FFFFFF",
    zIndex: 0
  },
  imageButton: {
    width: vw * 0.5,
    height: (vh * 0.75) / 14,
    alignItems: "center",
    //justifyContent: "center",
    flexDirection: "row",
    //borderBottomWidth: 0.5,
    borderColor: "gray"
  },
  imageButtonIcon: {
    width: 782 / 30,
    height: 608 / 30,
    marginLeft: vw * 0.02
  },
  imageButtonText: {
    fontSize: 18,
    fontWeight: "300",
    color: "#333333",
    marginLeft: vw * 0.02
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
    top: vh * 0.15,
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
    height: (vh * 0.5) / 7,
    justifyContent: "center",
    paddingLeft: vw / 50
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
    top: vh * 0.15,
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
    height: (vh * 0.6) / 8,
    justifyContent: "center",
    paddingLeft: vw / 50
  },
  /** 트랙 표시 모달 style
   * TrackPageO : 카테고리 모달이 on 일 때
   * TrackPageX : 카테고리 모달이 off 일 때
   * trackItem : FlatList 로 카테고리를 목록으로 만들 때 각각의 style
   */
  TrackPageO: {
    position: "absolute",
    borderWidth: 1,
    left: vw * 0.05,
    top: vh * 0.15,
    height: vh * 0.75,
    backgroundColor: "#FFFFFF",
    zIndex: 53
  },
  TrackPageX: {
    position: "absolute",
    borderWidth: 1,
    left: 100,
    top: 250,
    backgroundColor: "#FFFFFF",
    zIndex: 0
  },
  trackItem: {
    width: (vw * 9) / 10,
    height: (vh * 0.75) / 14,
    justifyContent: "center",
    paddingLeft: vw / 50
  },
  departmentItem: {
    width: (vw * 9) / 10,
    height: (vh * 0.75) / 14,
    justifyContent: "center",
    paddingLeft: vw / 50
  },
  collegeItem: {
    width: (vw * 9) / 10,
    height: (vh * 0.75) / 14,
    justifyContent: "center",
    paddingLeft: vw / 50
  }
});

export default AddScreen;
