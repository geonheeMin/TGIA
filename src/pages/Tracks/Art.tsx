import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Alert } from 'react-native';
import { styles } from '../../styles/TrackListStyle';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ArtPramList = {
  Art: undefined,
}

type Art = NativeStackScreenProps<ArtPramList, "Art">;

function Art({navigation}: Art) {
  const [modalVisible, setModalVisible] = useState(false);
  const [trackNum, setTrackNum] = useState(0);

  const toProfile = useCallback(() => {
    navigation.reset({ routes: [{ name: "Profile" }] });
  }, [navigation]);

  function changeTrack() {
    Alert.alert("변경되었습니다", "", [
      { text: "OK", onPress: toProfile }
    ])
  } 

  const tracks = [
    {
      id: 't10',
      num: 0,
      name: '동양화전공',
      value: '동양화전공',
    },
    {
      id: 't11',
      num: 1,
      name: '서양화전공',
      value: '서양화전공',
    },
    {
      id: 't12',
      num: 2,
      name: '한국무용전공',
      value: '한국무용전공',
    },
    {
      id: 't13',
      num: 3,
      name: '현대무용전공',
      value: '현대무용전공',
    },
    {
      id: 't14',
      num: 4,
      name: '발레전공',
      value: '발레전공',
    },
    {
      id: 't15',
      num: 5,
      name: '이민ㆍ다문화트랙',
      value: '이민ㆍ다문화트랙',
    }    
  ]

  const trackList = tracks.map((track) => 
    <Pressable key={track.id}
      style={styles.menuButton}
      onPress={() => {setTrackNum(track.num); setModalVisible(true);}}>
      <Text>{track.name}</Text>
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
              <Text style={styles.modalText}>{tracks[trackNum].name}</Text>
            </View>
            <View style={styles.selectZone}>
            <Pressable
              style={styles.buttonSelect}
              onPress={() => {
                setModalVisible(!modalVisible)
                changeTrack()
              }}>
              <Text style={styles.textSelect}>1트랙으로 설정</Text>
            </Pressable>
            <Pressable
              style={styles.buttonSelect}
              onPress={() => setModalVisible(!modalVisible)}>
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


export default Art;