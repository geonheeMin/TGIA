import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet, Image, Alert } from 'react-native';

function PurchaseHistory() {

  

  const onSubmit = useCallback( () => {
    Alert.alert('알림', 'ㅎㅇ');
  }, []);

  return(
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image source={require('../../assets/diptyque.jpg')} style={styles.itemImage}/>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 3세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn} onPress={onSubmit}>
          <Text style={styles.reviewText}>거래후기 남기기</Text>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image source={require('../../assets/bugi.png')} style={styles.itemImage}/>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 4세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn} onPress={onSubmit}>
          <Text style={styles.reviewText}>거래후기 남기기</Text>
        </Pressable>

        <Pressable style={styles.items} onPress={onSubmit}>
          <View style={styles.itemImageZone}>
            <Image source={require('../../assets/bugi.png')} style={styles.itemImage}/>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>에어팟 5세대 팝니다</Text>
            <Text style={styles.itemPrice}>160,000원</Text>
          </View>
        </Pressable>
        <Pressable style={styles.reviewBtn} onPress={onSubmit}>
          <Text style={styles.reviewText}>거래후기 남기기</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#EEEEEE',
    flex: 1,
  },

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
  reviewBtn: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1.5,
    borderBottomWidth: 10,
    borderColor: '#EEEEEE',
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3064e7',
    textAlign: 'center',
  },  
});

export default PurchaseHistory;