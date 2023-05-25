import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  TouchableHighlight,
  Animated,
  TouchableOpacity,
  FlatList
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import ItemList from "../Board/ItemList";
import { useIsFocused } from "@react-navigation/native";
import Axios from "axios";
import useStore from "../../../store";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

const TABS = [{ label: "판매중" }, { label: "거래완료" }];

type ChangeProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ChangeProfile"
>;

function SalesHistory({ navigation, route }: ChangeProfileScreenProps) {
  const { session, url } = useStore();
  const [content, setContent] = useState(0);
  const position = new Animated.Value(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [newPosts, setNewPosts] = useState([{}]);
  const [posts, setPosts] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [complitedPosts, setComplitedPosts] = useState([]);
  const [profileImg, setProfileImg] = useState(route.params.profile_img);
  const [img, setImg] = useState({});
  // const [complitedPosts, setComplitedPosts] = useState(
  //   postlist.postlist.sort((a, b) => b.post_id - a.post_id)
  // );

  const tabUnderline = (tabNum: number) => {
    Animated.spring(position, {
      toValue: tabNum === 0 ? 0 : 1,
      useNativeDriver: false
    }).start();
  };

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  const onSubmit = useCallback(() => {
    Alert.alert("알림", "ㅎㅇ");
    console.log(profileImg);
  }, []);

  function OnSale() {
    tabUnderline(0);

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
        createdDate: item.createdDate,
        item_name: item.item_name
      };
      return <ItemList board={renderBoard} navigation={navigation} />;
    };

    useEffect(() => {
      if (!isLoaded) {
        Axios.get(`${url}/post/my_list?userId=` + session.member_id)
          .then((res) => {
            setPosts(res.data);
            posts.sort((a, b) => b.post_id - a.post_id);
            setNewPosts(posts);
            console.log("완료");
            setIsLoaded(!isLoaded);
          })
          .catch((error) => {
            console.log(error);
            console.log(posts);
          });
      }
    }, []);

    return (
      <View>
        {posts.length >= 1 ? (
          <FlatList
            style={{ marginTop: 0 }}
            data={posts}
            renderItem={renderItem}
            refreshing={isRefreshing}
          />
        ) : (
          <View style={styles.tabContentNone}>
            <Text style={styles.tabContentNoneText}>
              판매중인 게시물이 없어요.
            </Text>
          </View>
        )}
      </View>
    );
  }

  function Completed() {
    tabUnderline(1);
    return (
      <View>
        {complitedPosts.length >= 1 ? (
          <View>
            <Text>test</Text>
          </View>
        ) : (
          <View style={styles.tabContentNone}>
            <Text style={styles.tabContentNoneText}>
              거래 완료된 게시글이 없어요.
            </Text>
          </View>
        )}
      </View>
    );
  }

  function selectComponent(content: number) {
    switch (content) {
      case 0:
        return <OnSale />;
      case 1:
        return <Completed />;
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={toProfile}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/design/backIcon.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: vw / 40 }}>
          판매내역
        </Text>
      </View>
      <View style={styles.topzone}>
        <View style={{ flex: 2, paddingVertical: 18 }}>
          <View style={styles.titlezone}>
            <Text
              style={{ fontSize: 20, fontWeight: "500", marginLeft: vw / 50 }}
            >
              나의 판매내역
            </Text>
          </View>
          <View style={styles.titlezone}>
            <TouchableHighlight
              style={styles.writeButton}
              underlayColor="#4e77e1"
              onPress={onSubmit}
            >
              <Text style={{ color: "white" }}>글쓰기</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View
          style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}
        ></View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={
              Object.keys(img).length === 0
                ? { uri: `${url}/images/${profileImg}` }
                : { uri: img?.uri }
            }
            style={styles.profile}
          />
        </View>
      </View>

      <View style={styles.typezone}>
        {TABS.map((tab, index) => (
          <TouchableHighlight
            style={styles.menuButton}
            underlayColor="#c5d5fc"
            key={index}
            onPress={() => setContent(index)}
          >
            <Text
              style={[
                styles.btnText,
                index === content && styles.btnActiveText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableHighlight>
        ))}
      </View>
      <Animated.View
        style={[
          styles.underline,
          {
            left: position.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "50%"]
            })
          }
        ]}
      />
      <View style={styles.listZone}>{selectComponent(content)}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "white",
    flex: 1
  },

  topBar: {
    borderBottomWidth: 0.2,
    borderColor: "gray",
    height: vh / 18,
    flexDirection: "row",
    alignItems: "center"
  },
  backButton: {
    width: vw / 22,
    height: vh / 36
  },
  backButtonImg: {
    width: vw / 12,
    height: vh / 28,
    marginLeft: vw / 50
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
  },
  profile: {
    flex: 0.56,
    width: "77%",
    height: "77%",
    alignItems: "baseline",
    borderRadius: 100,
    borderWidth: 0.3
  },
  topzone: {
    flex: 1.4,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: -30,
    marginVertical: -vh / 80
  },
  titlezone: {
    flex: 1,
    justifyContent: "center"
  },
  typezone: {
    flex: 0.5,
    flexDirection: "row"
  },
  listZone: {
    flex: 6,
    borderTopWidth: 0.2,
    borderColor: "gray"
  },
  writeButton: {
    backgroundColor: "#1440af",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: vw / 80,
    marginRight: vw / 3.1
  },
  menuButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    fontSize: 15,
    color: "#a7a7a7"
  },
  btnActiveText: {
    fontWeight: "600",
    color: "black"
  },
  underline: {
    marginLeft: 1,
    bottom: 0,
    height: 3,
    width: vw / 2,
    backgroundColor: "#3064e7"
  },
  tabContent: {
    backgroundColor: "skyblue"
  },
  tabContentNone: {
    position: "absolute",
    alignItems: "center",
    marginVertical: vh / 3,
    left: "27.5%"
  },
  tabContentNoneText: {
    fontSize: 16,
    color: "gray"
  },
  items: {
    paddingBottom: 5,
    borderBottomWidth: 0.3,
    flexDirection: "row"
  },
  itemImageZone: {
    flex: 1,
    paddingVertical: 15
  },
  itemInfo: {
    flex: 2
  },
  itemImage: {
    flex: 1,
    width: "85%",
    height: "85%",
    paddingVertical: "39%",
    marginLeft: 15,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 0.3
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 20,
    marginLeft: 16
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 10,
    marginLeft: 16
  }
});

export default SalesHistory;
