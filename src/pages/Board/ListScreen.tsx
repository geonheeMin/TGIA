import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useEffect, useState} from 'react';
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
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import Axios from 'axios';
import ItemList from './ItemList';
import postlist from '../../assets/dummy/postdata.json';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabNavi from '../../../App';
import writeIcon from '../../assets/pen1.png';

type RootStackParamList = {
  List: undefined;
};
type ListScreenProps = NativeStackScreenProps<RootStackParamList, 'List'>;

interface Board {
  post_id: number;
  title: string;
  price: number;
  writer: string;
  category: string;
  content: string;
  date: string;
  img: string;
}

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;
const Tab = createBottomTabNavigator();

function ListScreen({route, navigation}: ListScreenProps) {
  const id = route?.params?.id;
  const [posts, setPosts] = useState(postlist.postlist);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const filterList = [
    {label: '전체보기', value: 'all'},
    {label: '도서', value: 'book'},
    {label: '필기구', value: 'pencil'},
    {label: '생활/가전', value: 'life'},
    {label: '의류', value: 'clothes'},
    {label: '뷰티/미용', value: 'beauty'},
    {label: '전자기기', value: 'digital'},
    {label: '부기굿즈', value: 'goods'},
  ];
  const [filter, setFilter] = useState(filterList[0]);
  const [newPosts, setNewPosts] = useState([{}]);

  const onClick = useCallback(() => {
    navigation.navigate('Add', {id: id});
  }, [id, navigation]);

  const filtering = () => {
    if (filter.label === filterList[0].label) {
      setNewPosts(posts);
    }
    else {
      setNewPosts(posts.filter(post => post.category === filter.value));
    }
  };

  const filterCycle = () => {
    console.log('entered filterCycle');
    switch(filter.label) {
      case filterList[0].label: setFilter(filterList[1]); break;
      case filterList[1].label: setFilter(filterList[2]); break;
      case filterList[2].label: setFilter(filterList[3]); break;
      case filterList[3].label: setFilter(filterList[4]); break;
      case filterList[4].label: setFilter(filterList[5]); break;
      case filterList[5].label: setFilter(filterList[6]); break;
      case filterList[6].label: setFilter(filterList[7]); break;
      case filterList[7].label: setFilter(filterList[0]); break;
    }
  }

  // const onSelectImage = () => {
  //   launchImageLibrary(
  //     {
  //       mediaType: 'photo',
  //       maxWidth: 512,
  //       maxHeight: 512,
  //       includeBase64: Platform.OS === 'android',
  //     },
  //     res => {
  //       console.log(res);
  //       if (res.didCancel) return;
  //       setResponse(res);
  //       console.log(response?.assets[0]?.uri);
  //     },
  //   );
  // };

  const renderItem = ({item}) => {
    const renderBoard:Board = {
      post_id: item.post_id,
      title: item.title,
      price: item.price,
      writer: item.writer,
      category: item.category,
      content: item.content,
      date: item.date,
      img: item.img
    };
    return <ItemList id={id} board={renderBoard} navigation={navigation} />;
  };

  const listRefresh = () => {
    // setIsRefreshing(true);
    // Axios.get('http://localhost:8080/api/list')
    //   .then(res => {
    //     setPosts(res.data);
    //   })
    //   .catch(error => {
    //     console.log(error.response.data);
    //   });
    // setIsRefreshing(false);
  };

  const addItem = useCallback(() => {
    navigation.navigate('Add', {id: id});
  }, [navigation, id]);

  const toFav = useCallback(() => {
    navigation.navigate('Fav', {id: id});
  }, [navigation, id]);

  const toChatList = useCallback(() => {
    navigation.navigate('ChatList', {id: id});
  }, [navigation, id]);

  useEffect(() => {
    // Axios.get('http://localhost:8080/api/list').then(res => {
    //   setPosts(res.data);
    // });
    filtering();
    listRefresh();
  }, [isFocused, filter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.filterButton}
          onPress={filterCycle}>
          <Text>{filter.label}</Text><View style={styles.triangle}/>
        </Pressable>
        <View style={{flex: 2, alignItems: 'flex-end'}}>
          <Text>hi</Text>
        </View>
      </View>
      <FlatList
        style={styles.itemList}
        data={newPosts}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        refreshControl={
          <RefreshControl onRefresh={listRefresh} refreshing={isRefreshing} />
        }/>
      <Pressable
        style={styles.writeButton}
        onPress={onClick}>
        <Image source={writeIcon} style={{width: 60, height: 60}}/>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: 'white',
  },
  seperator: {
    backgroundColor: '#727272',
    opacity: 0.4,
    height: 0.34,
  },
  topBar: {
    borderBottomWidth: 0.2,
    height: vh / 17.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemList: {
    marginTop: 0,
  },
  filterButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: vw / 30,
    height: vh / 20,
    width: vw / 4,
    flexDirection: 'row',
    alignSelf: 'baseline',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderRightWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopColor: '#000000',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 77,
  },
  writeButton: {
    backgroundColor: '#0c61fe',
    position: 'absolute',
    zIndex: 999,
    width: 60, height: 60,
    borderRadius: 30,
    left: vw / 1.24,
    top: vh / 1.27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receivedID: {},
  titleInput: {},
  categoryInput: {},
  contentInput: {},
  priceInput: {},
});

export default ListScreen;
