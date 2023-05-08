import { StyleSheet, Dimensions } from "react-native";

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;


export const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: 'white',
    flex: 1,
    marginLeft: vw / 30,
  },
  menuButton: {
    marginHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 0.2,
    borderColor: 'gray',
  },
  trackNameText: {
    color: "black",
  },
  modalBase: {
    position: 'relative',
  },
  centeredView: {
    position: 'absolute',
    flex: 1,
    top: vh * 0.33,
    left: vw * 0.08,
  },
  modalView: {
    margin: 15,
    backgroundColor: '#3064e7',
    borderRadius: 20,
    paddingHorizontal: vw / 25,
    paddingVertical: vh / 34,
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
    paddingVertical: vh / 54,
    paddingHorizontal: vw / 26,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  buttonClose: {
    borderRadius: 10,
    marginVertical: 6,
    paddingVertical: vh / 78,
    paddingHorizontal: vw / 3.4,
    elevation: 2,
    backgroundColor: 'white',
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
    fontSize: 21,
    fontWeight: '700',
  },  
});