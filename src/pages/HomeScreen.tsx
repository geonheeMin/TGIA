import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {ScreenContainer} from 'react-native-screens';
import logo from '../../assets/logo.png';
import Axios from 'axios';

type RootStackParamList = {
  Home: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

function HomeScreen({navigation}: HomeScreenProps) {
  const [id, setId] = useState('');
  const onClick = useCallback(() => {
    // console.log(id);
    // Axios.post(
    //   'http://localhost:8080/api/login',
    //   {},
    //   {params: {user_id: id}},
    // ).then(res => {
    //   if (res.data === 'success') {
    //     navigation.navigate('List', {id: id});
    //   } else {
    //     console.log('로그인 실패');
    //   }
    // });
    navigation.navigate('List', {id: id});
  }, [id, navigation]);

  // useEffect(() => {
  //   Axios.get<Blob>('http://localhost:8080/api/image', {
  //     params: {
  //       id: '1',
  //     },
  //     responseType: 'blob',
  //   }).then(res => {
  //     const myFile = new Blob([res.data]);
  //     setImgdb(myFile);
  //   });
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.informations}>
          <TextInput
            style={styles.idInput}
            onChange={e => setId(e.nativeEvent.text)}
            autoCapitalize="none"
          />
          <Text>{id}</Text>
          <TextInput secureTextEntry={true} style={styles.passwordInput} />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={onClick}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 15}}>로그인</Text>
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
  logo: {
    marginTop: vh / 2.5,
    marginBottom: vh / 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  informations: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vh / 50,
    marginTop: vh / 2.3,
  },
  idInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    borderRadius: 3,
    width: vw / 1.75,
    height: 30,
    marginBottom: vh / 75,
  },
  passwordInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    borderRadius: 3,
    width: vw / 1.75,
    height: 30,
  },
  buttons: {
    marginTop: vh / 15,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  registerButton: {
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#99a6cd',
    borderRadius: 5,
    marginRight: vw / 50,
  },
  loginButton: {
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b0eff',
    borderRadius: 5,
    marginLeft: vw / 50,
  },
});

export default HomeScreen;
