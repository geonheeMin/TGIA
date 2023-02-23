import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { styles } from '../../styles/TrackListStyle';

function Art() {
  const [modalVisible, setModalVisible] = useState(false);
  const [trackNum, setTrackNum] = useState(0);
  const tracks = [
    {
      id: 't10',
      num: 0,
      name: '동양화전공', 
      value: 10
    },
    {
      id: 't11',
      num: 1,
      name: '서양화전공',
      value: 11
    },
    {
      id: 't12',
      num: 2,
      name: '한국무용전공', 
      value: 12
    },
    {
      id: 't13',
      num: 3,
      name: '현대무용전공',
      value: 13
    },
    {
      id: 't14',
      num: 4,
      name: '발레전공', 
      value: 14
    },
    {
      id: 't15',
      num: 5,
      name: '이민ㆍ다문화트랙',
      value: 15
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
      {trackList}
    </View>
  );
}


export default Art;