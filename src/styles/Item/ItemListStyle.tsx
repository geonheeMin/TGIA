import {StyleSheet, Dimensions} from 'react-native';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  items: {
    paddingBottom: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  itemImageZone: {
    flex: 1,
    paddingVertical: 15,
  },
  itemInfo: {
    flex: 2,
  },
  itemImage: {
    flex: 1,
    width: '85%',
    height: '85%',
    paddingVertical: '39%',
    marginLeft: 18,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 0.3,
    overflow: 'hidden'
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 20,
    marginLeft: 16,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 10,
    marginLeft: 16,
  },
})