import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import Creative from '../Tracks/Creative';
import Art from '../Tracks/Art';
import SocialScience from '../Tracks/SocialScience';
import GlobalFashion from '../Tracks/GlobalFashion';
import ICTDesign from '../Tracks/ICTDesign';
import BeautyDesign from '../Tracks/BeautyDesign';
import ComputerEngineering from '../Tracks/ComputerEngineering';
import Mechanical from '../Tracks/Mechanical';
import ITConvergence from '../Tracks/ITConvergence';
import SmartManagement from '../Tracks/SmartManagement';
import SmartFactory from '../Tracks/SmartFactory';


type TrackSettingScreenProps = NativeStackScreenProps<RootStackParamList, 'TrackSetting'>;

function TrackSetting({navigation}: TrackSettingScreenProps) {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [visible6, setVisible6] = useState(false);
  const [visible7, setVisible7] = useState(false);
  const [visible8, setVisible8] = useState(false);
  const [visible9, setVisible9] = useState(false);
  const [visible10, setVisible10] = useState(false);
  const [visible11, setVisible11] = useState(false);

  return(
    <SafeAreaView style={styles.safeAreaView}>
    <ScrollView>
      <View style={styles.menuZone}>
        <View style={styles.collegeZone}>
          <Text style={styles.collegeName}>크리에이티브인문예술대학</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible(!visible)}>
          <Text style={styles.departName}>크리에이티브 인문학부</Text>
        </TouchableOpacity>
        {visible && <Creative /> }
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible2(!visible2)}>
          <Text style={styles.departName}>예술학부</Text>
        </TouchableOpacity>
        {visible2 && <Art />}
      </View>
      <View style={styles.menuZone}>
        <View style={styles.collegeZone}>
          <Text style={styles.collegeName}>미래융합사회과학대학</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible3(!visible3)}>
          <Text style={styles.departName}>사회과학부</Text>
        </TouchableOpacity>
        {visible3 && <SocialScience />}
      </View>
      <View style={styles.menuZone}>
        <View style={styles.collegeZone}>
          <Text style={styles.collegeName}>디자인대학</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible4(!visible4)}>
          <Text style={styles.departName}>글로벌패션산업학부</Text>
        </TouchableOpacity>
        {visible4 && <GlobalFashion />}
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible5(!visible5)}>
          <Text style={styles.departName}>ICT디자인학부</Text>
        </TouchableOpacity>
        {visible5 && <ICTDesign />}
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible6(!visible6)}>
          <Text style={styles.departName}>뷰티디자인매니지먼트학과</Text>
        </TouchableOpacity>
        {visible6 && <BeautyDesign />}
      </View>
      <View style={styles.menuZone}>
        <View style={styles.collegeZone}>
          <Text style={styles.collegeName}>IT공과대학</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible7(!visible7)}>
          <Text style={styles.departName}>컴퓨터공학부</Text>
        </TouchableOpacity>
        {visible7 && <ComputerEngineering />}
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible8(!visible8)}>
          <Text style={styles.departName}>기계전자공학부</Text>
        </TouchableOpacity>
        {visible8 && <Mechanical />}
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible9(!visible9)}>
          <Text style={styles.departName}>IT융합공학부</Text>
        </TouchableOpacity>
        {visible9 && <ITConvergence />}
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible10(!visible10)}>
          <Text style={styles.departName}>스마트경영공학부</Text>
        </TouchableOpacity>
        {visible10 && <SmartManagement />}
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => setVisible11(!visible11)}>
          <Text style={styles.departName}>스마트팩토리컨설팅학과</Text>
        </TouchableOpacity>
        {visible11 && <SmartFactory />}             
      </View>
    </ScrollView>                   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: 'white',
    flex: 1,
  },
  menuZone: {
    flex: 1.1,
    borderTopWidth: 0.2,
    marginBottom: 15,
    borderColor: 'gray',
  },
  collegeZone: {
    backgroundColor: '#3064e7', 
    paddingVertical: 15,
  },
  menuButton: {
    marginVertical: 10,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderColor: 'gray',
  },
  collegeName: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
  },
  departName: {
    fontSize: 15,
  }
});

export default TrackSetting;