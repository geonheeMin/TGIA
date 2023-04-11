import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  Image,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import LocationCalc from "../../components/LocationCalc";
import useStore from "../../../store";
import Axios from "axios";
import { WebView } from 'react-native-webview';


const vw = Dimensions.get("window").width;
const vh = Dimensions.get("window").height;

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

function Settings({ navigation }: SettingsScreenProps) {
  const { session, url } = useStore();
  const [webViewUrl, setWebViewUrl] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const toProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  const productInfo = {
    post_id: 18,
    user_id: 8,
    buyer_id: 9,
    price: 10000,
    item_name: "에어팟",
  }

  // const [kakaoPayUrl, setKakaoPayUrl] = useState(null);
  // useEffect(() => {
  //   const fetchKakaoPayUrl = async () => {
  //     try {
  //       const response = await Axios.post(`${url}/payment/ready`, productInfo);
  //       setKakaoPayUrl(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchKakaoPayUrl();
  // }, []);

  const handleWebViewNavigation_2 = (newNavState) => {
    const { url } = newNavState;
    if (url.includes('success')) {
      // 카카오페이 결제가 완료되었을 때의 처리
      // WebViewRef.current.stopLoading(); // 웹뷰 중지
      // WebViewRef.current.goBack(); // 이전 페이지로 이동
      // redirectPage(); // 리다이렉트 처리
    }
  };

  const test22 = () => {
    //Axios.post("http://15.164.93.133:8080/payment/ready", request)
    Axios.post(`${url}/payment/ready`, productInfo)
    .then((res) => {  
    console.log(res.data)
    //Linking.openURL(res.data.next_redirect_app_url)
    setWebViewUrl(res.data.next_redirect_mobile_url)
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const handleWebViewNavigation = navState => {
    const { url } = navState;
    // 카카오페이 결제 과정에서 URL이 변경되는 것을 감지하고, 성공 URL 여부를 판별하여 처리
    if (url.includes('https://example.com/payment/success')) {
      setPaymentSuccess(true);
    }
  };

  const handlePaymentComplete = () => {
    // 결제가 완료된 경우, WebView를 닫고 페이지를 리다이렉트함
    // 예를 들어, 다른 화면으로 이동하거나 모달을 닫는 등의 작업을 수행할 수 있음
    console.log('Payment complete!');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={toProfile}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/design/backIcon.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
      </View>
      <LocationCalc />

      <Pressable onPress={test22} style={{margin: 30}}>
          <Text style={{color: 'blue'}}>kakao test</Text>
      </Pressable>

      {/* <WebView
      //ref={(ref) => (WebViewRef.current = ref)}
      source={{ uri: kakaoPayUrl }}
      onNavigationStateChange={handleWebViewNavigation}
      /> */}
      <View style={{flex: 1}}>
        {webViewUrl && (
          <WebView
            source={{ uri: webViewUrl }}
            onNavigationStateChange={handleWebViewNavigation}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            automaticallyAdjustContentInsets={false}
            onShouldStartLoadWithRequest={request => {
              // 결제 완료된 경우 WebView를 닫고 페이지를 리다이렉트함
              // 여기서는 웹 뷰에서 카카오페이 결제를 완료하고, 성공 URL로 리다이렉트하는 페이지를 닫고 리액트 네이티브 앱으로 돌아오는 예시를 들었습니다.
              if (paymentSuccess) {
                handlePaymentComplete();
                return false;
              }
              return true;
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "white",
    width: vw,
    height: vh
  },
  topBar: {
    borderBottomWidth: 0.2,
    borderColor: "gray",
    height: vh / 18,
    flexDirection: "row",
    alignItems: "center"
  },
  backButton: {
    width: vw / 22,
    height: vh / 36
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: vw / 35,
    paddingRight: vw / 35,
    height: vh / 17.5
  }
});

export default Settings;