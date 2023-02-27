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
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import Axios from 'axios';
import ItemList from './ItemList';

type RootStackParamList = {
  Detail: undefined;
};
type ItemDetailProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

interface board {
  post_id: number;
  title: string;
  writer: string;
  category: string;
  content: string;
  price: number;
  date: string;
}

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

function ItemDetail({route, navigation}: ItemDetailProps) {
  const board = route.params.board;
  const writer = board.writer;
  const id = route.params.id ? route.params.id : 'null';
  const [isFav, setIsFav] = useState('');
  const [pressed, setPressed] = useState(false);
  const [category, setCategory] = useState('');
  const toUpdate = useCallback(() => {
    navigation.navigate('Add', {id: id, board: board});
  }, [id, board, navigation]);
  const toChat = useCallback(() => {
    navigation.navigate('ChatDetail', {id: id, other: writer});
  }, [id, writer, navigation]);

  const favorite = () => {
    // isFav === '관심 등록'
    //   ? Axios.post(
    //       'http://localhost:8080/api/favorite',
    //       {},
    //       {params: {board_id: board.id, user_id: id}},
    //     ).then(() => setIsFav('관심 해제'))
    //   : Axios.post(
    //       'http://localhost:8080/api/unfavorite',
    //       {},
    //       {params: {board_id: board.id, user_id: id}},
    //     ).then(() => setIsFav('관심 등록'));
  };

  const changeImageState = () => {
    setPressed(!pressed);
  };

  const matchingCategories = () => {
    switch(board.category) {
      case 'book': setCategory('도서'); break;
      case 'pencil': setCategory('필기구'); break;
      case 'clothes': setCategory('의류'); break;
      case 'digital': setCategory('디지털 기기'); break;
      case 'beauty': setCategory('뷰티/미용'); break;
      case 'goods': setCategory('부기 굿즈'); break;
    }
  };

  useEffect(() => {
    // Axios.get('http://localhost:8080/api/favorite', {
    //   params: {board_id: board.id, user_id: id},
    // }).then(res => {
    //   console.log(res.data);
    //   res.data === 1 ? setIsFav('관심 해제') : setIsFav('관심 등록');
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    matchingCategories();
  }, [isFav]);

  return (
    <View style={pressed ? {backgroundColor: 'black'} : styles.container}>
      <Pressable onPress={changeImageState}>
        <Image source={{uri: board.img}} style={pressed ? styles.pressedImage : styles.postImage}/>
      </Pressable>
      <StatusBar barStyle={pressed ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <View
          style={{
            marginTop: 15,
            marginBottom: 30,
          }}>
          <TouchableOpacity onPress={id === writer ? toUpdate : toChat}>
            <Text>{id === writer ? '수정' : '문의하기'}</Text>
          </TouchableOpacity>
          <View style={styles.postTitle}>
            <Text
              style={{
                fontSize: 31.5,
                fontWeight: '400',
                color: 'black',
              }}>
              {board.title}
            </Text>
          </View>
          <Text
            style={styles.postWriter}>
            {board.writer}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
            {category}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
            {board.content}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
            {board.date}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
              {board.price.toLocaleString()}원
          </Text>
          <TouchableOpacity onPress={favorite}>
            <Text>{isFav}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  postImage: {
    width: vw,
    height: vh / 2.5,
    overflow: 'hidden'
  },
  pressedImage: {
    width: vw,
    height: vh / 1.35,
    backgroundColor: 'black',
    marginVertical: vh / 10,
  },
  postTitle: {
    FlexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: vw / 70,
  },
  postWriter: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
    marginLeft: vw / 60,
  },
  postCategory: {
    
  }
});

export default ItemDetail;