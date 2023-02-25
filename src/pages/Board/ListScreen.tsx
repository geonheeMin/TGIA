import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ListRenderItem,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Platform,
  PermissionsAndroid,
  Image,
  StatusBar,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import Axios from 'axios';
import ItemList from './ItemList';
import postlist from '../../assets/dummy/postdata.json';

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

function ListScreen({route, navigation}: ListScreenProps) {
  const id = route.params.id;
  const [posts, setPosts] = useState(postlist.postlist);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const onClick = useCallback(() => {
    navigation.navigate('List', {id: id});
  }, [id, navigation]);

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
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{
          height: vh / 10,
          backgroundColor: '#007eff',
        }}>
        <StatusBar barStyle={'light-content'} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          {/* <TouchableOpacity onPress={onSelectImage}>
            <Text>사진 저장</Text>
          </TouchableOpacity>
          <Image
            style={{width: 512, height: 341}}
            source={{uri: response?.assets[0]?.uri}}
          /> */}
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
            {id}
          </Text>
        </View>
        <View
          style={{
            flex: 3,
            justifyContent: 'center',
            marginRight: 20,
            marginBottom: 20,
            flexDirection: 'row',
          }}>
          <TouchableOpacity style={{marginRight: vw / 50}} onPress={toFav}>
            <Text>찜 목록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginRight: vw / 50}} onPress={addItem}>
            <Text>상품 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginRight: vw / 50}} onPress={toChatList}>
            <Text>채팅</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <FlatList
        style={{height: vh / 1.5}}
        data={posts}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl onRefresh={listRefresh} refreshing={isRefreshing} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  receivedID: {},
  titleInput: {},
  categoryInput: {},
  contentInput: {},
  priceInput: {},
});

export default ListScreen;
