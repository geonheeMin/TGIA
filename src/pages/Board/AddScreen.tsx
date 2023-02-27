import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
//import BoardModel from '../models/BoardModel';
import Axios from 'axios';

type RootStackParamList = {
  Add: undefined;
};
type AddScreenProps = NativeStackScreenProps<RootStackParamList, 'Add'>;

interface Board {
  title: string;
  category: string;
  content: string;
  user: string;
  date: string;
};

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

function AddScreen({route, navigation}: AddScreenProps) {
  const params = route.params;
  const id = params.id;
  const board = params.board ? params.board : 'new';
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');
  const [postButton, setPostButton] = useState('');
  const [opened, setOpened] = useState(false);
  const [uri, setUri] = useState(null);
  const [img, setImg] = useState({});
  const [categories, setCategories] = useState([
    {label: '도서', value: 'book'},
    {label: '필기구', value: 'pencil'},
    {label: '의류', value: 'clothes'},
    {label: '디지털 기기', value: 'digital'},
    {label: '뷰티/미용', value: 'beauty'},
    {label: '부기 굿즈', value: 'goods'},
  ]);
  const formData = new FormData();

  var date = new Date();
  var postTime = new Intl.DateTimeFormat('locale', {
    dateStyle: 'long',
    timeStyle: 'medium',
  }).format(date);

  function renderScreen() {
    if (board !== 'new') {
      setTitle(board.title);
      setCategory(board.category);
      setContent(board.content);
      setTime(board.date);
      setPostButton('수정');
    } else {
      setTime(postTime);
      setPostButton('등록');
    }
  }

  function AddButton() {
    if (postButton === '등록') {
      Alert.alert('게시글 등록', '게시글을 등록하시겠습니까?', [
        {text: '취소', style: 'cancel'},
        {text: '등록', onPress: postAdd},
      ]);
    } else {
      Alert.alert('게시글 수정', '게시글을 수정하시겠습니까?', [
        {text: '취소', style: 'cancel'},
        {text: '수정', onPress: postUpdate},
      ]);
    }
  }

  function CancelButton() {
    Alert.alert('게시글 취소', '취소하시겠습니까?', [
      {text: '예', onPress: onClick},
      {text: '아니요', style: 'cancel'},
    ]);
  }

  function postAdd() {
    const post: Board = {
      title: title,
      category: category,
      content: content,
      user: id,
      date: time,
    };
    formData.append('post', post); //게시글 객체
    formData.append('image', {
      uri: img.uri, //이미지 uri
      type: img.type, //이미지 타입(image/jpeg)
      name: img.fileName //이미지 파일 이름
    })
    // Axios.post('api', formData, {headers: {'Content-Type': 'multipart/form-data',},});
    console.log(JSON.stringify(formData));
    onClick();
  }

  function postUpdate() {
    // Axios.get('http://localhost:8080/api/update', {
    //   params: {
    //     title: title,
    //     user: id,
    //     category: category,
    //     content: content,
    //     date: time,
    //   },
    // });
    // board.title = title;
    // board.id = id;
    // board.category = category;
    // board.content = content;
    // board.date = time;
    afterUpdate();
  }

  const onClick = useCallback(() => {
    navigation.navigate('List', {id: id});
  }, [id, navigation]);

  const afterUpdate = useCallback(() => {
    navigation.navigate('Detail', {id: id, board: board});
  }, [id, board, navigation]);

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, (res) => {
      if (res.didCancel) {
        console.log('Canceled');
      }
      else if (res.errorCode) {
        console.log('Errored');
      }
      else {
        setImg(res.assets[0]);
      };
        setUri(img.uri);
      }
    );
  };
  

  useEffect(() => {
    renderScreen();
  }, []);

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView style={styles.container} nestedScrollEnabled={true}>
        <View>
          <Text>{id}</Text>
          <Text>
            등록 화면
            {time}
          </Text>
        </View>
        <View style={styles.dataForm}>
          <Text style={styles.dataHint}>제목</Text>
          <TextInput
            style={styles.dataInput}
            onChange={e => {
              setTitle(e.nativeEvent.text);
            }}
            value={title}
          />
          <Text style={styles.dataHint}>카테고리</Text>
          <DropDownPicker
            open={opened}
            value={category}
            items={categories}
            setOpen={setOpened}
            setValue={setCategory}
            setItems={setCategories}
            placeholder={'카테고리를 선택하십시오'}
            style={styles.categoryPicker}
            showArrowIcon={false}
          />
          <Text style={styles.dataHint}>내용</Text>
          <TextInput
            style={styles.contentInput}
            multiline={true}
            onChange={e => {
              setContent(e.nativeEvent.text);
            }}
            value={content}
          />
          <TouchableOpacity
            onPress={pickImage}>
            <Text>이미지 선택</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formButtons}>
          <TouchableOpacity
            style={{
              backgroundColor: 'lightgrey',
              width: 50,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={CancelButton}>
            <Text style={{color: 'white'}}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#4444FF',
              width: 50,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={AddButton}>
            <Text style={{color: 'white'}}>{postButton}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    width: vw,
    height: vh,
    backgroundColor: 'white',
  },
  container: {
    marginHorizontal: vw / 20,
    marginTop: vh / 15,
  },
  dataForm: {
    marginTop: vh / 50,
    flex: 6,
    flexDirection: 'column',
  },
  dataHint: {
    color: 'grey',
    fontWeight: 'bold',
  },
  dataInput: {
    marginTop: vh / 100,
    marginBottom: vh / 100,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    width: vw - vw / 10,
    height: 30,
    paddingLeft: 7.5,
  },
  contentInput: {
    marginTop: vh / 100,
    marginBottom: vh / 100,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    width: vw - vw / 10,
    height: 300,
    textAlignVertical: 'top',
    paddingTop: 5,
    paddingBottom: 0,
    paddingLeft: 7.5,
  },
  formButtons: {
    flex: 2,
    flexDirection: 'row',
    marginHorizontal: vw / 25,
  },
  categoryPicker: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 0,
    backgroundColor: 'white',
    minHeight: 35,
    marginTop: vh / 100,
    marginBottom: vh / 100,
    paddingLeft: 7.5,
  },
});

export default AddScreen;