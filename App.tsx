import * as React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator } from "react-native";
import HomeScreen from "./src/pages/HomeScreen";
import Profile from "./src/pages/Profile/Profile";

import TrackSetting from "./src/pages/Profile/TrackSetting";
import SalesHistory from "./src/pages/Profile/SalesHistory";
import PurchaseHistory from "./src/pages/Profile/PurchaseHistory";

import ListScreen from "./src/pages/Board/ListScreen";
import ItemDetail from "./src/pages/Board/ItemDetail";
import AddScreen from "./src/pages/Board/AddScreen";
import SearchScreen from "./src/pages/Search/SearchScreen";
import SearchResultScreen from "./src/pages/Search/SearchResultScreen";
import FavScreen from "./src/pages/Profile/FavScreen";
import ChatDetail from "./src/pages/Chat/ChatDetail";
import ChatListScreen from "./src/pages/Chat/ChatListScreen";
import ChatListFromPostScreen from "./src/pages/Chat/ChatListFromPostScreen";
import ChangeProfile from "./src/pages/Profile/ChangeProfile";
import Settings from "./src/pages/Profile/Settings";
import Creative from "./src/pages/Tracks/Creative";
import MannerInfo from "./src/pages/Profile/MannerInfo";
import MannerReview from "./src/pages/Profile/MannerReview";
import SalesList from "./src/pages/Profile/SalesList";
import MannerReviewList from "./src/pages/Profile/MannerReviewList";
import PaymentScreen from "./src/pages/Chat/PaymentScreen";
import TryPaymentScreen from "./src/pages/Chat/TryPaymentScreen";
import CategorySearchScreen from "./src/pages/Search/CategorySearchScreen";
import useStore from "./store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { not } from "react-native-reanimated";

export type RootStackParamList = {
  Home: undefined;
  List: {
    id: string;
    password: string;
  };
  Add: undefined;
  Profile: undefined;
  ProductList: undefined;
  TrackSetting: undefined;
  SalesHistory: undefined;
  PurchaseHistory: undefined;
  Detail: undefined;
  Fav: undefined;
  ChatList: undefined;
  ChatListFromPost: undefined;
  ChatDetail: undefined;
  ChatTitle: undefined;
  ChangeProfile: undefined;
  Settings: undefined;
  Creative: undefined;
  Payment: undefined;
  Sales: undefined;
  MannerReviewList: undefined;
};

export type LoginStackParamList = {
  LoginHome: undefined;
  TabHome: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

export function SplashScreen() {
  return (
    <View>
      <ActivityIndicator />
    </View>
  );
}

export function ListStackScreen(route) {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen name="List" options={{ headerShown: false }}>
        {(props) => <ListScreen {...route} />}
      </Stack.Screen>
      <Stack.Screen name="Add" options={{ headerShown: false }}>
        {(props) => <AddScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Detail" options={{ headerShown: false }}>
        {(props) => <ItemDetail {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Fav" options={{ headerShown: false }}>
        {(props) => <FavScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ChatList" options={{ headerShown: false }}>
        {(props) => <ChatListScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ChatDetail" options={{ headerShown: false }}>
        {(props) => <ChatDetail {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export function FavStackScreen(route) {
  return (
    <Stack.Navigator initialRouteName="Fav">
      <Stack.Screen name="Fav">
        {(props) => <FavScreen {...route} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "프로필" }}
      />
      <Stack.Screen
        name="TrackSetting"
        component={TrackSetting}
        options={{ title: "트랙 설정" }}
      />
      <Stack.Screen
        name="SalesHistory"
        component={SalesHistory}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="PurchaseHistory"
        component={PurchaseHistory}
        options={{ title: "구매 내역" }}
      />
      <Stack.Screen
        name="Fav"
        component={FavScreen}
        options={{ title: "관심 목록" }}
      />
    </Stack.Navigator>
  );
}

export function TabNavi() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          tabBarStyle: { display: "none" },
          tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>
        }}
      >
        {(props) => <HomeScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen name="List" options={{ headerShown: false }}>
        {(props) => <ListStackScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Fav"
        options={{ title: "상품 목록", headerShown: false }}
      >
        {(props) => <FavStackScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="ProfileHome"
        component={ProfileStackScreen}
        options={{ title: "프로필", headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const { session, setSession, hasSession, setHasSession } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem("session").then((value) => {
      if (value !== null) {
        const user = JSON.parse(value);
        setSession(user);
        setHasSession(true);
        setIsLoading(false);
      } else {
        setHasSession(false);
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={hasSession ? "List" : "Home"}>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false, animation: "none" }}
        >
          {(props) => <HomeScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="List"
          options={{ headerShown: false, animation: "none" }}
        >
          {(props) => <ListScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Detail" options={{ headerShown: false }}>
          {(props) => <ItemDetail {...props} />}
        </Stack.Screen>
        <Stack.Screen name="ChatDetail" options={{ headerShown: false }}>
          {(props) => <ChatDetail {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="ChatList"
          options={{ headerShown: false, animation: "none" }}
        >
          {(props) => <ChatListScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="ChatListFromPost"
          options={{ headerShown: false, animation: "none" }}
        >
          {(props) => <ChatListFromPostScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="Profile"
          options={{ headerShown: false, animation: "none" }}
        >
          {(props) => <Profile {...props} />}
        </Stack.Screen>
        <Stack.Screen name="TrackSetting" options={{ headerShown: false }}>
          {(props) => <TrackSetting {...props} />}
        </Stack.Screen>
        <Stack.Screen name="SalesHistory" options={{ headerShown: false }}>
          {(props) => <SalesHistory {...props} />}
        </Stack.Screen>
        <Stack.Screen name="PurchaseHistory" options={{ headerShown: false }}>
          {(props) => <PurchaseHistory {...props} />}
        </Stack.Screen>
        <Stack.Screen name="ChangeProfile" options={{ headerShown: false }}>
          {(props) => <ChangeProfile {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Fav" options={{ headerShown: false }}>
          {(props) => <FavScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Add" options={{ headerShown: false }}>
          {(props) => <AddScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Settings" options={{ headerShown: false }}>
          {(props) => <Settings {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="Search"
          options={{ headerShown: false, animation: "none" }}
        >
          {(props) => <SearchScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="SearchResult" options={{ headerShown: false }}>
          {(props) => <SearchResultScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Creative" options={{ headerShown: false }}>
          {(props) => <Creative {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Payment" options={{ headerShown: false }}>
          {(props) => <PaymentScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="CategorySearch" options={{ headerShown: false }}>
          {(props) => <CategorySearchScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="TryPayment" options={{ headerShown: false }}>
          {(props) => <TryPaymentScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="MannerInfo"
          options={{ headerShown: false }}
        >
          {(props) => <MannerInfo {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="MannerReview"
          options={{ headerShown: false }}
        >
          {(props) => <MannerReview {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="SalesList"
          options={{ headerShown: false }}
        >
          {(props) => <SalesList {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="MannerReviewList"
          options={{ headerShown: false }}
        >
          {(props) => <MannerReviewList {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
