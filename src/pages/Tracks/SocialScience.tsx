import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { styles } from '../../styles/TrackListStyle';

function SocialScience() {
  const [modalVisible, setModalVisible] = useState(false);
  const [trackNum, setTrackNum] = useState(0);
  const tracks = [
    {
      id: 't16',
      num: 0,
      name: '국제무역트랙', 
      value: 16
    },
    {
      id: 't17',
      num: 1,
      name: '글로벌비즈니스트랙',
      value: 17
    },
    {
      id: 't18',
      num: 2,
      name: '기업ㆍ경제분석트랙', 
      value: 18
    },
    {
      id: 't19',
      num: 3,
      name: '경제금융투자트랙',
      value: 19
    },
    {
      id: 't20',
      num: 4,
      name: '공공행정트랙', 
      value: 20
    },
    {
      id: 't21',
      num: 5,
      name: '법&정책트랙',
      value: 21
    },
    {
      id: 't22',
      num: 6,
      name: '부동산자산관리트랙', 
      value: 22
    },
    {
      id: 't23',
      num: 7,
      name: '스마트도시계획ㆍ환경비즈니스트랙',
      value: 23
    },
    {
      id: 't24',
      num: 8,
      name: '기업경영트랙', 
      value: 24
    },
    {
      id: 't25',
      num: 9,
      name: '벤쳐경영트랙',
      value: 25
    },
    {
      id: 't26',
      num: 10,
      name: '회계ㆍ재무경영트랙', 
      value: 26
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


export default SocialScience;