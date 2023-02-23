import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { styles } from '../../styles/TrackListStyle';

function Creative() {
  const [modalVisible, setModalVisible] = useState(false);
  const [trackNum, setTrackNum] = useState(0);
  const outSection = useRef();
  const tracks = [
    {
      id: 't01',
      num: 0,
      name: '영미문학트랙', 
      value: 1
    },
    {
      id: 't02',
      num: 1,
      name: '영미언어정보트랙',
      value: 2
    },
    {
      id: 't03',
      num: 2,
      name: '한국어교육트랙', 
      value: 3
    },
    {
      id: 't04',
      num: 3,
      name: '문학문화콘텐츠트랙',
      value: 4
    },
    {
      id: 't05',
      num: 4,
      name: '글로컬역사트랙', 
      value: 5
    },
    {
      id: 't06',
      num: 5,
      name: '역사문화콘텐츠트랙',
      value: 6
    },
    {
      id: 't07',
      num: 6,
      name: '도서관정보문화트랙',
      value: 7
    },
    {
      id: 't08',
      num: 7,
      name: '디지털인문정보학트랙', 
      value: 8
    },
    {
      id: 't09',
      num: 8,
      name: '역사문화큐레이션트랙',
      value: 9
    }
  ]

  // const toCreative = useCallback(() => {
  //   navigation.navigate('Creative');
  // }, [navigation]);
  // const toArt = useCallback(() => {
  //   navigation.navigate('Art');
  // }, [navigation]);
  // const toSocialScience = useCallback(() => {
  //   navigation.navigate('SocialScience');
  // }, [navigation]);
  // const toGlobalFashion = useCallback(() => {
  //   navigation.navigate('GlobalFashion');
  // }, [navigation]);
  // const toICTDesign = useCallback(() => {
  //   navigation.navigate('ICTDesign');
  // }, [navigation]);
  // const toBeautyDesign = useCallback(() => {
  //   navigation.navigate('BeautyDesign');
  // }, [navigation]);
  // const toComputerEngineering = useCallback(() => {
  //   navigation.navigate('ComputerEngineering');
  // }, [navigation]);
  // const toMechanical = useCallback(() => {
  //   navigation.navigate('Mechanical');
  // }, [navigation]);
  // const toITConvergence = useCallback(() => {
  //   navigation.navigate('ITConvergence');
  // }, [navigation]);
  // const toSmartManagement = useCallback(() => {
  //   navigation.navigate('SmartManagement');
  // }, [navigation]);
  // const toSmartFactory = useCallback(() => {
  //   navigation.navigate('SmartFactory');
  // }, [navigation]);


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
              onPress={() => setModalVisible(!modalVisible)}>
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
      <Text style={{fontSize:18, marginLeft: 15, marginTop: 20, marginBottom: 5}}>크리에이티브 인문학부</Text>
      {trackList}                 
    </View>
  );
}


export default Creative;