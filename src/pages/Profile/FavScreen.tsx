import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import {ScreenContainer} from 'react-native-screens';
import {useIsFocused} from '@react-navigation/native';
import Axios from 'axios';
import ItemList from '../Board/ItemList';

type RootStackParamList = {
  Fav: undefined;
};
type FavScreenProps = NativeStackScreenProps<RootStackParamList, 'Fav'>;

function FavScreen({route, navigation}: FavScreenProps) {
  const id = route.params.id;
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderItem = ({item}) => {
    return <ItemList id={id} board={item} navigation={navigation} />;
  };
  const listRefresh = () => {
    // setIsRefreshing(true);
    // Axios.get('http://localhost:8080/api/favlist', {
    //   params: {
    //     user_id: id,
    //   },
    // })
    //   .then(res => {
    //     setPosts(res.data);
    //     console.log(res.data);
    //   })
    //   .catch(error => {
    //     console.log(error.response.data);
    //   });
    // setIsRefreshing(false);
  };

  useEffect(() => {
    Axios.get('http://localhost:8080/api/favlist', {
      params: {
        user_id: id,
      },
    }).then(res => {
      setPosts(res.data);
    });
  }, [isFocused]);
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>{id} 님의 찜 목록</Text>
        </View>
      </ScrollView>
      <FlatList renderItem={renderItem} data={posts} />
    </SafeAreaView>
  );
}

export default FavScreen;