import * as React from 'react';
import {Text, View, Pressable, TextInput, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import { useCallback, useState, useRef } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';

type ProductRegistrationProps = NativeStackScreenProps<ParamListBase, 'ProductRegistration'>;

// function ProductRegister() {
//   try {
//     const response = await axios.post("http://000.000.00.000:8081/regist",
//     { product, price, quantity });
//     Alert.alert('알림', '상품이 등록되었습니다.');
//   } catch (error) {
//     console.error(error.response);
//   }
// }
// axios,post("url", data)
// .then(function response)

 


function ProductRegistration({navigation}: ProductRegistrationProps) {
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const productRef = useRef<TextInput | null>(null);
  const priceRef = useRef<TextInput | null>(null);
  const quantityRef = useRef<TextInput | null>(null);

  const onChangeProduct = useCallback((text) => {
    setProduct(text);
  }, []);
  const onChangePrice = useCallback((text) => {
    setPrice(text);
  }, []);
  const onChangeQuantity = useCallback((text) => {
    setQuantity(text);
  }, []);

  const onSubmit = useCallback( () => {
    Alert.alert('알림', '등록되었습니다.');
  }, []);

  const canGoNext = product && price && quantity;

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
    }}>
    <KeyboardAwareScrollView>
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>상품명</Text>
        <TextInput
        style={styles.textInput}
        placeholder="상품명을 입력하세요"
        onChangeText={onChangeProduct}
        returnKeyType="next"
        keyboardType="default"
        onSubmitEditing={() => {
          priceRef.current?.focus();
        }}
        blurOnSubmit={false}
        clearButtonMode="while-editing"  // iOS에서만 동작
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>가격</Text>
        <TextInput
        style={styles.textInput}
        placeholder="가격을 입력하세요"
        onChangeText={onChangeProduct}
        returnKeyType="next"
        keyboardType="decimal-pad"
        onSubmitEditing={() => {
          quantityRef.current?.focus();
        }}
        blurOnSubmit={false}
        ref={priceRef}
        clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>수량</Text>
        <TextInput
        style={styles.textInput}
        placeholder="수량을 입력하세요"
        onChangeText={onChangeProduct}
        keyboardType="decimal-pad"
        ref={quantityRef}
        onSubmitEditing={onSubmit}
        clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </Pressable>
        <Pressable
          onPress={onSubmit}
          style={
            !canGoNext
            ? styles.submitButton
            : StyleSheet.compose(styles.submitButton, styles.submitButtonActive)
          }
          disabled={!canGoNext}>
          <Text style={styles.submitButtonText}>등록</Text>
        </Pressable>
      </View>
    </View>
    </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 15,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 5,
  },
  submitButtonActive: {
    backgroundColor: 'blue',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonZone: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default ProductRegistration;