import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/pages/HomeScreen';
import Profile from './src/pages/Profile/Profile';

import TrackSetting from './src/pages/Profile/TrackSetting';
import SalesHistory from './src/pages/Profile/SalesHistory';
import PurchaseHistory from './src/pages/Profile/PurchaseHistory';

import ListScreen from './src/pages/Board/ListScreen';
import ItemList from './src/pages/Board/ItemList';
import ItemDetail from './src/pages/Board/ItemDetail';
import AddScreen from './src/pages/Board/AddScreen';
import FavScreen from './src/pages/Profile/FavScreen';
import ChatDetail from './src/pages/Chat/ChatDetail';
import ChatListScreen from './src/pages/Chat/ChatListScreen';
import ChatTitle from './src/pages/Chat/ChatTitle';


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
  ChatDetail: undefined;
  ChatTitle: undefined;

  Test2: undefined;
};

export type LoginStackParamList = {
  LoginHome: undefined;
  TabHome: undefined;
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function ListStackScreen() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '홈화면', headerShown: false}}
      />
      <Stack.Screen name="List" options={{headerShown: false}}>
        {props => <ListScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Add" options={{headerShown: false}}>
        {props => <AddScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Detail" options={{headerShown: false}}>
        {props => <ItemDetail {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Fav" options={{headerShown: false}}>
        {props => <FavScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ChatList" options={{headerShown: false}}>
        {props => <ChatListScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ChatDetail" options={{headerShown: false}}>
        {props => <ChatDetail {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}


function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={{title: '프로필'}}/>
      <Stack.Screen name="TrackSetting" component={TrackSetting} options={{title: '트랙 설정'}}/>
      <Stack.Screen name="SalesHistory" component={SalesHistory} options={{title: ''}}/>
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} options={{title: '구매 내역'}}/>
      <Stack.Screen name="Fav" component={FavScreen} options={{title: '관심 목록'}}/>
    </Stack.Navigator>
  );
}

function TabNavi() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: '홈 화면', tabBarStyle: {display: 'none'}}}
      />
      <Tab.Screen
        name="List"
        component={ListStackScreen}
        options={{title: '상품 목록', headerShown: false}}
      />
      {/* <Tab.Screen
        name="Chatting"
        component={HomeScreen}
        options={{title: '채팅'}}
      /> */}
      <Tab.Screen
        name="ProfileHome"
        component={ProfileStackScreen}
        options={{title: '프로필', headerShown: false}}
      />
    </Tab.Navigator>
  );
}

// function LoginStackScreen() {
//   return(
//     <LoginStack.Navigator>
//       <LoginStack.Screen
//           name="LoginHome"
//           component={HomeScreen}
//           options={{title: '홈화면', headerShown: false}}
//       />
//       <LoginStack.Screen
//           name="TabHome"
//           component={TabNavi}
//           options={{title: '로그인후', headerShown: false}}
//       />
//     </LoginStack.Navigator>
//   );
// }

function App() {
  return (
    <NavigationContainer >
      <TabNavi />
    </NavigationContainer>
  );
}

export default App;