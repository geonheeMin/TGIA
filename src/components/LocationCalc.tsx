import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import Geolocation from "@react-native-community/geolocation";

function LocationCalc() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLogitude] = useState(0);
  const [distance, setDistance] = useState(1000);
  const [isHanusng, setIsHansung] = useState("false");

  const Hansung = { latitude: 37.582429, longitude: 127.010084 };
  const HansungOut = { latitude: 37.08236, longitude: 127.01116 };
  const Hansung2 = { latitude: 37.58359, longitude: 127.00953 };

  // 현재 위치 불러오는 함수
  const geoLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);

        setLatitude(latitude);
        setLogitude(longitude);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  // 거리 계산 함수
  const distanceCalc = (Point, lat: number, lon: number) => {
    const radius = 6371;
    let toRadian = Math.PI / 180;
    let deltaLatitude = Math.abs(Point.latitude - lat) * toRadian;
    let deltaLongitude = Math.abs(Point.longitude - lon) * toRadian;
    let sinDeltaLat = Math.sin(deltaLatitude / 2);
    let sinDeltaLng = Math.sin(deltaLongitude / 2);

    const squareRoot = Math.sqrt(
      sinDeltaLat * sinDeltaLat +
        Math.cos(Point.latitude * toRadian) *
          Math.cos(lat * toRadian) *
          sinDeltaLng *
          sinDeltaLng
    );
    setDistance(2 * radius * Math.asin(squareRoot) * 1000);

    // 150m 기준으로 판단
    if (2 * radius * Math.asin(squareRoot) * 1000 <= 150) setIsHansung("true");
    else setIsHansung("false");
  };

  useEffect(() => {
    geoLocation();
  }, [latitude]);

  return (
    <View style={{ marginLeft: 30 }}>
      <Text> latitude: {latitude} </Text>
      <Text> longitude: {longitude} </Text>
      <TouchableOpacity
        onPress={() => distanceCalc(Hansung, latitude, longitude)}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "orange" }}> Distance Calc </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20 }}>
        <Text>거리 : {distance} m</Text>
        <Text>in Hansung : {isHanusng}</Text>
      </View>
    </View>
  );
}

export default LocationCalc;
