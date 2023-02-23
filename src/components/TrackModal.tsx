import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Modal } from 'react-native';

function TrackModal() {
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

  return(
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}>
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

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: 'white',
    flex: 1,
  },
  menuButton: {
    marginHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 0.2,
    borderColor: 'gray',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 15,
    backgroundColor: '#3064e7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  trackNameView:{
    marginTop: 10,
  },
  selectZone: {
    flexDirection: 'row',
  },
  buttonSelect: {
    marginHorizontal: 3,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  buttonClose: {
    borderRadius: 10,
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 115,
    elevation: 2,
    backgroundColor: 'white',
    //backgroundColor: '#525252',
  },
  textSelect: {
    color: '#3064e7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textCancel: {
    color: '#b41b1bba',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    color: 'white',
    fontSize: 23,
  },  
});

export default TrackModal;