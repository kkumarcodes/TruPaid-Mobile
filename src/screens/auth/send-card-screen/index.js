import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar, Text, ScrollView, KeyboardAvoidingView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import MainOutlineButton from '../../../components/main-outline-button';
import InputTextCard from '../../../components/input-text-card';
import DropDownPicker from 'react-native-dropdown-picker';
import InputCardBox from '../../../components/input-card-box';

const SendCardScreen = () => {
  const dispatch = useDispatch();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressNext = () => {
    navigation.navigate('SelectTopics');
  };

  const HeaderLayout = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[CommonStyle.text20_inter_m, {textAlign: 'center', lineHeight: 26}]}>
          {'Where should we send\nyour card?'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        title={'Contact information'}
        leftIcon={Theme.arrow_left}
        onPressLeft={onPressLeft}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView style={styles.body}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
        >
          {HeaderLayout()}

          <View style={{flex: 1, marginTop: WINDOW_HEIGHT * 0.05}}>
            <InputCardBox
              title={'Street'}
              value={street}
              placeholder={'Your street address'}
              onChangeText={(text) => setStreet(text)}
              returnKeyType={'done'}
            />
          </View>

          <View style={{flex: 1, marginTop: 20}}>
            <InputCardBox
              title={'Your city'}
              value={city}
              placeholder={'Choose your city'}
              onChangeText={(text) => setCity(text)}
              returnKeyType={'done'}
            />
          </View>

          <View style={{flex: 1, marginTop: 20}}>
            <InputCardBox
              title={'Zipcode'}
              value={zipCode}
              placeholder={'Your zipcode'}
              onChangeText={(text) => setZipCode(text)}
              keyboardType={'numeric'}
              maxLength={6}
              returnKeyType={'done'}
            />
          </View>

          <View style={{height: 50}}/>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.btnContainer}
      >
        <MainButton
          title={'Next'}
          isValid={true}
          onPress={onPressNext}
        />

        <View style={{height: 10}}/>

        <MainOutlineButton
          title={'Skip'}
          isValid={true}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  headerContainer: {
    paddingTop: WINDOW_HEIGHT * 0.035,
    paddingHorizontal: PADDING_HOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
  placeholder: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#979797',
  },
  input: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Theme.grey,
  },
  dropDownContainerStyle: {
    borderRadius: 6,
    borderColor: '#EAEAEA',
    borderWidth: 1,
  },
  inputStyle: {
    borderWidth: 0,
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    borderRadius: 0,
    zIndex: 10,
  },
});

export default SendCardScreen;
