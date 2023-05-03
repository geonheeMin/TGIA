import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useStore from '../../../store';

const { width: vw, height: vh } = Dimensions.get('window');

type PaymentPramList = {
    Payment: undefined,
  }
  type PaymentProps = NativeStackScreenProps<PaymentPramList, "Payment">;

function PaymentCompleted({navigation}: PaymentProps) {

  const toProfile = useCallback(() => {
      navigation.reset({ routes: [{ name: "Profile" }] });
  }, [navigation])


  return(
      <SafeAreaView style={styles.safeAreaView}>
          <Text>Payment</Text>
          <Pressable onPress={toProfile}>
              <Text>결제 완료</Text>
          </Pressable>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
  backgroundColor: "white",
  width: vw,
  height: vh
  },
})

export default PaymentCompleted;