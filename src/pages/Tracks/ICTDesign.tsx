import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { styles } from '../../styles/TrackListStyle';

function ICTDesign() {
  const [modalVisible, setModalVisible] = useState(false);
  const [trackNum, setTrackNum] = useState(0);
  const outSection = useRef();
  const tracks = [
    {
      id: 't30',
      num: 0,
      name: '뉴미디어광고ㆍ커뮤니케이션디자인트랙', 
      value: 30
    },
    {
      id: 't31',
      num: 1,
      name: '영상ㆍ애니메이션디자인트랙',
      value: 31
    },
    {
      id: 't32',
      num: 2,
      name: '제품ㆍ서비스디자인트랙', 
      value: 32
    },
    {
      id: 't33',
      num: 3,
      name: '브랜드ㆍ패키지디자인트랙',
      value: 33
    },
    {
      id: 't34',
      num: 4,
      name: '인테리어디자인 트랙', 
      value: 34
    },
    {
      id: 't35',
      num: 5,
      name: 'VMDㆍ전시디자인트랙',
      value: 35
    },
    {
      id: 't36',
      num: 6,
      name: '게임그래픽디자인트랙',
      value: 36
    },
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


export default ICTDesign;