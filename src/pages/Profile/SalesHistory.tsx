import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
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
import Axios from "axios";
import useStore from "../../../store";
import { Post } from "../../types/PostType";
import IonIcon from "react-native-vector-icons/Ionicons";

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
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [sellingPosts, setSellingPosts] = useState<Array<Post>>([]);
  const [completedPosts, setCompletedPosts] = useState<Array<Post>>([]);
  const [profileImg, setProfileImg] = useState();
  const [img, setImg] = useState({});
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [topZoneHeight, setTopZoneHeight] = useState(0);
  const [typeZoneHeight, setTypeZoneHeight] = useState(0);
  useEffect(() => {
    console.log("useEffect");
    Axios.get(`${url}/post/my_list?userId=` + session?.member_id)
      .then((res) => {
        setSellingPosts(res.data);
        sellingPosts.sort((a, b) => b.post_id - a.post_id);
      })
      .catch((error) => {
        console.log(error);
      });
    Axios.get(`${url}/post/my_SellList?userId=${session?.member_id}`)
      .then((res) => {
        setCompletedPosts(res.data);
        completedPosts.sort((a, b) => b.post_id - a.post_id);
      })
      .catch((err) => console.log(err));
  }, []);

  const tabUnderline = (tabNum: number) => {
    Animated.spring(position, {
      toValue: tabNum === 0 ? 0 : 1,
      useNativeDriver: false
    }).start();
  };

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  const toWrite = useCallback(() => {
    navigation.navigate("Add");
  }, [navigation]);

  const onSubmit = useCallback(() => {
    Alert.alert("알림", "ㅎㅇ");
    console.log(profileImg);
  }, []);

  useEffect(() => {
    Axios.get(`${url}/post/my_list?userId=` + session?.member_id)
      .then((res) => {
        setSellingPosts(res.data);
        sellingPosts.sort((a, b) => b.post_id - a.post_id);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
        console.log(posts);
      });
    Axios.get(`${url}/post/my_sell_list?userId=${session?.member_id}`)
      .then((res) => {
        setCompletedPosts(res.data);
        completedPosts.sort((a, b) => b.post_id - a.post_id);
        //setIsLoaded(!isLoaded);
      })
      .catch((err) => console.log(posts));
  }, []);

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

  function OnSale() {
    tabUnderline(0);

    return (
      <View>
        {sellingPosts.length >= 1 ? (
          <FlatList
            style={{ marginTop: 0 }}
            data={sellingPosts}
            renderItem={renderItem}
            refreshing={isRefreshing}
          />
        ) : (
          <View
            style={[
              styles.tabContentNone,
              { height: vh - topBarHeight - topZoneHeight - typeZoneHeight }
            ]}
          >
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
        {completedPosts.length >= 1 ? (
          <FlatList
            style={{ marginTop: 0 }}
            data={completedPosts}
            renderItem={renderItem}
            refreshing={isRefreshing}
          />
        ) : (
          <View
            style={[
              styles.tabContentNone,
              { height: vh - topBarHeight - topZoneHeight - typeZoneHeight }
            ]}
          >
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
      <View
        style={styles.topBar}
        onLayout={(e) => setTopBarHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={toProfile}
          activeOpacity={0.5}
        >
          <IonIcon name={"chevron-back-sharp"} size={25} />
        </TouchableOpacity>
        <Text style={styles.topBarText}>판매내역</Text>
      </View>
      <View
        style={styles.topzone}
        onLayout={(e) => setTopZoneHeight(e.nativeEvent.layout.height)}
      >
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
              onPress={toWrite}
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
            source={{
              uri: `${url}/images/${session?.imageFileName}`
            }}
            style={styles.profile}
          />
        </View>
      </View>

      <View
        style={styles.typezone}
        onLayout={(e) => setTypeZoneHeight(e.nativeEvent.layout.height)}
      >
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
  topBarText: {
    fontSize: 18,
    fontWeight: "600"
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
  },
  profile: {
    width: vw / 5,
    height: vw / 5,
    borderRadius: vw / 5,
    alignItems: "baseline",
    borderWidth: 0.3,
    borderColor: 'black'
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
    justifyContent: "center",
    alignItems: "center",
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
    width: vw,
    justifyContent: "center",
    alignItems: "center"
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
