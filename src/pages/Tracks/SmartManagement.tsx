import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { styles } from '../../styles/TrackListStyle';

function SmartManagement() {
  const [modalVisible, setModalVisible] = useState(false);
  const [trackNum, setTrackNum] = useState(0);
  const outSection = useRef();
  const tracks = [
    {
      id: 't52',
      num: 0,
      name: '산업공학트랙',
      value: '산업공학트랙',
    },
    {
      id: 't53',
      num: 1,
      name: '지능형제조시스템트랙',
      value: '지능형제조시스템트랙',
    },
    {
      id: 't54',
      num: 2,
      name: '시스템경영공학트랙',
      value: '시스템경영공학트랙',
    },
    {
      id: 't55',
      num: 3,
      name: '생산물류시스템트랙',
      value: '생산물류시스템트랙',
    },
    {
      id: 't56',
      num: 4,
      name: '컨설팅트랙',
      value: '컨설팅트랙',
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


export default SmartManagement;