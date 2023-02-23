import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Axios from 'axios';

type RootStackParamList = {
  item: undefined;
};
type itemListProps = NativeStackScreenProps<RootStackParamList, 'item'>;

function ItemList({id, board, navigation}: itemListProps) {
  const [postId, setPostId] = useState(board.id);
  const toDetail = useCallback(() => {
    navigation.navigate('Detail', {id: id, board: board});
  }, [id, board, navigation]);

  return (
    <TouchableOpacity
      style={{flex: 2, flexDirection: 'column'}}
      onPress={toDetail}>
      <Text style={{fontSize: 30, color: 'black'}}>{board.title}</Text>
      <Text style={{fontSize: 15, color: 'black'}}>{board.user}</Text>
    </TouchableOpacity>
  );
}

export default ItemList;