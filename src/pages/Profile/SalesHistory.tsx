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
  TouchableOpacity
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

const TABS = [{ label: "판매중" }, { label: "거래완료" }];

type ChangeProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ChangeProfile"
>;

function SalesHistory({ navigation }: ChangeProfileScreenProps) {
  const [content, setContent] = useState(0);
  const position = new Animated.Value(0);

  const tabUnderline = (tabNum: number) => {
    Animated.spring(position, {
      //toValue: tabNum === 0 ? 0 : tabNum === 1 ? 1 : 2,
      toValue: tabNum === 0 ? 0 : 1,
      useNativeDriver: false
    }).start();
  };

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  const onSubmit = useCallback(() => {
    Alert.alert("알림", "ㅎㅇ");
  }, []);

  function OnSale() {
    tabUnderline(0);
    return (
      <View>
        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/diptyque.jpg")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 3세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
            <TouchableHighlight
              style={styles.compliteButton}
              onPress={onSubmit}
              underlayColor="#4e77e1"
            >
              <Text style={styles.compliteText}>판매완료</Text>
            </TouchableHighlight>
          </View>
        </Pressable>

        <TouchableHighlight onPress={onSubmit}>
          <View style={styles.items}>
            <View style={styles.itemImageZone}>
              <Image
                source={require("../../assets/diptyque.jpg")}
                style={styles.itemImage}
              />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>에어팟 3세대 팝니다</Text>
              <Text style={styles.itemPrice}>160,000원</Text>
            </View>
          </View>
        </TouchableHighlight>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/bugi.png")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 4세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/diptyque.jpg")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 5세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/bugi.png")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 6세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image
              source={require("../../assets/diptyque.jpg")}
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 7세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        {/* <View style={styles.tabContentNone }>
          <Text>
            판매중인 게시물이 없어요.
          </Text>
        </View>      */}
      </View>
    );
  }

  function Completed() {
    tabUnderline(1);
    return (
      <View>
        <View style={styles.tabContentNone}>
          <Text style={{ fontSize: 16, color: "gray" }}>
            거래완료 게시글이 없어요.
          </Text>
        </View>
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
      </View>
      <View style={styles.topzone}>
        <View style={{ flex: 2, paddingVertical: 18 }}>
          <View style={styles.titlezone}>
            <Text style={{ fontSize: 20, marginLeft: vw / 50 }}>
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
            source={require("../../assets/bugi.png")}
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
      <View style={styles.listZone}>
        <ScrollView>{selectComponent(content)}</ScrollView>
      </View>
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
    //backgroundColor: '#3064e7',
  },
  compliteButton: {
    alignItems: "center",
    marginLeft: vw / 3,
    marginRight: vw / 20,
    marginTop: vh / 40,
    paddingVertical: vh / 80,
    paddingHorizontal: -vw,
    backgroundColor: "#3064e7",
    borderRadius: 10
  },
  compliteText: {
    color: "white"
  },
  profile: {
    flex: 0.6,
    width: "75%",
    height: "75%",
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
    left: "28.5%"
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
    fontWeight: "600",
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
