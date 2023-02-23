import React, { useState, useEffect, useCallback, useRef, Children, FunctionComponent } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Modal } from 'react-native';

type ModalProps = {
  activator?: FunctionComponent<{ handleOpen: () => void}>;
  children: React.ReactNode;
};

function SelectTrack({ activator: Activator, children}: ModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const tracks = [
    {
      id: 't00',
      name: '영미문학트랙', 
      value: '00'
    },
    {
      id: 't01',
      name: '영미언어정보트랙',
      value: '01'
    }
  ]
  return(
    <View>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          props.onRequestClose
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{props.children}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal 머냐이거</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>222222</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
      {/* <Modal
        visible={modalVisible}
      >
        <View style={styles.modalView}>
            <Text style={styles.modalText}>ddd</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
              >
              <Text style={styles.textStyle}>Hide Modal 머냐이거
              {children}
              </Text>
            </Pressable>
            <View>
            {Activator ? (
              <Activator handleOpen={() => setModalVisible(true)} /> : (
                <Pressable onPress={{} => setModalVisible(true) title="open"} />
              )
            )}
            </View>
        </View>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SelectTrack;