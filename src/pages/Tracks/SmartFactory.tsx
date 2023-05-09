import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, Modal, Alert } from 'react-native';
import { styles } from '../../styles/TrackListStyle';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useStore from '../../../store';
import Axios from 'axios';

type FactoryPramList = {
  Factory: undefined,
}
type Factory = NativeStackScreenProps<FactoryPramList, "Factory">;

function SmartFactory({navigation, aTrack, bTrack}: Factory) {
  const { session, url } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(session.member_id);
  const [trackNum, setTrackNum] = useState(0);
  const [trackId, setTrackId] = useState(0);
  const [trackName, setTrackName] = useState("트랙네임");
  const tracks = [
    {
      id: 't57',
      num: 0,
      name: '스마트팩토리컨설팅학과',
    },
  ]


  const toProfile = useCallback(() => {
    navigation.reset({ routes: [{ name: "Profile" }] });
  }, [navigation]);
  
  function changeTrack(trackNum: number, trackId: number, trackName: string) {
    setTrackNum(trackNum);
    setTrackId(trackId);
    setTrackName(trackName);
    
    const request = {
      userId: userId, // 유저 아이디
      trackNumber: trackNum,  // 1트랙이면 1, 2트랙이면 2
      trackId: trackId, // 트랙 테이블 아이디
      trackname: trackName // 트랙명
    };

    Axios.post(`${url}/profile/list/`, request)
    .then((res) => {
      console.log(res);
      console.log("변경됨");
    })
    .catch((error) => {
      console.log(error);
      console.log(request);
    })
    Alert.alert("변경되었습니다", "", [
      { text: "OK", onPress: toProfile }
    ]);
    console.log("trackId : " + trackId);
    console.log("trackName : " + trackName);
    console.log(request);
  }

  const trackList = tracks.map((track) => 
    <Pressable key={track.id}
      style={styles.menuButton}
      onPress={() => {setTrackNum(track.num); setModalVisible(true);}}>
      <Text style={styles.trackNameText}>{track.name}</Text>
    </Pressable>
  );

  function TrackModal() {
    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <Pressable style={{flex:1, backgroundColor: '#2a2a2a', opacity: 0.3}}
          onPress={() => setModalVisible(false)} /> 
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.trackNameView}>
              <Text style={styles.modalText}>스마트팩토리컨설팅학과</Text>
            </View>
            <View style={styles.selectZone}>
            <Pressable
              style={styles.buttonSelect}
              onPress={() => {
                setModalVisible(!modalVisible)              
                changeTrack(1, aTrack, tracks[trackNum].name)
              }}
            >
              <Text style={styles.textSelect}>1트랙으로 설정</Text>
            </Pressable>
            <Pressable
              style={styles.buttonSelect}
              onPress={() => {
                setModalVisible(!modalVisible)
                changeTrack(2, bTrack, tracks[trackNum].name)
              }}
            >
              <Text style={styles.textSelect}>2트랙으로 설정</Text>
            </Pressable>
            </View>
            <Pressable
              style={styles.buttonClose}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textCancel}>취소</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return(
    <View style={styles.safeAreaView}>
      <TrackModal />
      {trackList}   
    </View>
  );
}


export default SmartFactory;