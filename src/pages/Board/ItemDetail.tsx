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
  const toUpdate = useCallback(() => {
    navigation.navigate('Add', {id: id, board: board});
  }, [id, board, navigation]);
  const toChat = useCallback(() => {
    navigation.navigate('ChatDetail', {id: id, other: writer});
  }, [id, writer, navigation]);
  const [isFav, setIsFav] = useState('');

  useEffect(() => {
    // Axios.get('http://localhost:8080/api/favorite', {
    //   params: {board_id: board.id, user_id: id},
    // }).then(res => {
    //   console.log(res.data);
    //   res.data === 1 ? setIsFav('관심 해제') : setIsFav('관심 등록');
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFav]);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
            marginBottom: 30,
          }}>
          <TouchableOpacity onPress={id === writer ? toUpdate : toChat}>
            <Text>{id === writer ? '수정' : '문의하기'}</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
            {board.post_id}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
            {board.title}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
            {board.writer}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: 'black',
            }}>
            {board.category}
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
    </SafeAreaView>
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

export default ItemDetail;