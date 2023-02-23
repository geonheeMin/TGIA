import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, SafeAreaView, ScrollView, Alert,
  Image, TouchableHighlight, Animated } from 'react-native';

const vw = Dimensions.get('window').width;
const vh = Dimensions.get('window').height;

const TABS = [
  { label: '판매중' },
  { label: '거래완료' },
  { label: '숨김' },
];

const ITEMS = [
  { title: '딥티크 롬브 팝니다', price: '200,000' },
  { title: '에어팟 3세대 팝니다', price: '160,000' },
  { title: '에어팟 4세대 팝니다', price: '160,000' },
  { title: '에어팟 5세대 팝니다', price: '160,000' },
  { title: '에어팟 6세대 팝니다', price: '160,000' },
];

function SalesHistory() {
  const [content, setContent] = useState(0);
  const position = new Animated.Value(0);

  const tabUnderline = (tabNum) => {
    Animated.spring(position, {
      toValue: tabNum === 0 ? 0 : tabNum === 1 ? 1 : 2,
      useNativeDriver: false,
    }).start();
  };

  const onSubmit = useCallback( () => {
    Alert.alert('알림', 'ㅎㅇ');
  }, []);

  function OnSale() {
    tabUnderline(0);
    return(
      <View>
        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image source={require('../../assets/diptyque.jpg')} style={styles.itemImage}/>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 3세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        <TouchableHighlight onPress={onSubmit} >
          <View style={styles.items}>
            <View style={styles.itemImageZone}>
              <Image source={require('../../assets/diptyque.jpg')} style={styles.itemImage}/>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>에어팟 3세대 팝니다</Text>
              <Text style={styles.itemPrice}>160,000원</Text>
            </View>
          </View>
        </TouchableHighlight>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image source={require('../../assets/bugi.png')} style={styles.itemImage}/>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 4세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image source={require('../../assets/diptyque.jpg')} style={styles.itemImage}/>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 5세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image source={require('../../assets/bugi.png')} style={styles.itemImage}/>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 6세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image source={require('../../assets/diptyque.jpg')} style={styles.itemImage}/>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 7세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>

        {/* <View style={styles.tabContentNone }>
          <Text>
            판매중인 게시물이 없어요.
          </Text>
        </View>      */}
      </View>
    );
  }
  
  function Completed() {
    tabUnderline(1);
    return(
      <View>
        <View style={styles.tabContentNone}>
          <Text style={{fontSize: 16, color: 'gray'}}>
            거래완료 게시글이 없어요.
          </Text>
        </View>
      </View>
    );
  }
  
  function Hide() {
    tabUnderline(2);
    return(
      <View style={styles.tabContent}>
        <View style={styles.tabContentNone}>
          <Text style={{fontSize: 16, color: 'gray'}}>
            숨기기 한 게시글이 없어요.
          </Text>
        </View>

      </View>
    );
  }

  function selectComponent (content) {
    switch (content) {
      case 0 :
        return <OnSale />
      case 1 :
        return <Completed />
      case 2 :
        return <Hide />
    }
  }


  return(
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topzone}>
        <View style={{flex:2, paddingVertical: 18}}>
          <View style={styles.titlezone}>
            <Text style={{fontSize:20, marginLeft: vw / 50}}>나의 판매내역</Text>
          </View>
          <View style={styles.titlezone}>
            <TouchableHighlight
              style={styles.writeBtn}
              underlayColor='#4e77e1'
              onPress={onSubmit}>
              <Text style={{color: 'white'}}>글쓰기</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{flex:0.8, alignItems:'center', justifyContent: 'center'}}>  
        </View>
        <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/bugi.png')} style={styles.profile}/>
        </View>
      </View>

      <View style={styles.typezone}>      
        {TABS.map((tab, index) => (
          <TouchableHighlight
            style={styles.menuBtn}
            underlayColor='#c5d5fc'
            key={index}
            onPress={() => setContent(index)}>
            <Text style={[styles.btnText, index === content && styles.btnActiveText]}>{tab.label}</Text>
          </TouchableHighlight>
        ))}
      </View>
      <Animated.View style={[styles.underline, { left: position.interpolate({
        inputRange: [0, 1, 2],
        outputRange: ['0%', '33%', '66%']
      })}]} />
      <View style={styles.listZone}>
        <ScrollView>
          {selectComponent(content)}
        </ScrollView>
      </View> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: 'white',
    flex: 1,
  },
  profile: {
    flex: 0.6,
    width: '75%',
    height: '75%',
    alignItems: 'baseline',
    borderRadius: 100,
    borderWidth: 0.3,
  },
  topzone: {
    flex:1.4,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: -30,
    marginVertical: - vh / 80,
  },
  titlezone: {
    flex: 1,
    justifyContent: 'center',
  },
  typezone: {
    flex: 0.5,
    flexDirection: 'row',
  },
  listZone: {
    flex: 6,
    borderTopWidth: 0.2,
    borderColor: 'gray',
  },
  writeBtn: {
    backgroundColor: '#3064e7',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: vw / 80,
    marginRight: vw / 3.1,
  },
  menuBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    color: '#a7a7a7',
    
  },
  btnActiveText: {
    fontWeight: '600',
    color: 'black',
  },
  underline: {
    marginLeft: 1,
    bottom: 0,
    height: 3,
    width: vw / 3,
    backgroundColor: '#3064e7',
  },
  tabContent: {
    backgroundColor: 'skyblue',
  },
  tabContentNone: {
    position: 'absolute',
    alignItems: 'center',
    marginVertical: vh / 3,
    left: '28.5%',
  },
  items: {
    paddingBottom: 5,
    borderBottomWidth: 0.3, 
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
    marginLeft: 15,
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 0.3,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 16,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 10,
    marginLeft: 16,
  },
});

export default SalesHistory;