import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import AptoNavHeader from '../../../components/apto-nav-header';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {CommonStyle} from '../../../styles';
import {setBirthDate} from '../../../redux/actions/apto';

const DATE_FORMAT = 'YYYY-MM-DD';
const AptoPersonalBirthdayScreen = () => {
  const dispatch = useDispatch();
  const [isValid, setValid] = useState(false);
  const [dateBirth, setDateBirth] = useState(DATE_FORMAT);
  const [birthday, setBirthDay] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const birthdate = useSelector(state => state?.apto?.birthdate);

  useEffect(() => {
    setValid(dateBirth !== DATE_FORMAT);
  }, [dateBirth]);

  useEffect(() => {
    if (birthdate) {
      setBirthDay(moment(birthdate, DATE_FORMAT).toDate());
      setDateBirth(birthdate);
    }
  }, [birthdate]);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressRight = () => {
    dispatch(setBirthDate(dateBirth));

    navigation.navigate('AptoPersonalNumber');
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    setDateBirth(moment(date).format(DATE_FORMAT));
    setBirthDay(date);
  };

  const InputLayout = () => {
    return (
      <View style={{flex: 1, marginTop: 20}}>
        <Text
          style={[
            CommonStyle.text12_inter_m,
            {color: Theme.black, paddingBottom: 8},
          ]}>
          Birthday
        </Text>

        <TouchableOpacity
          onPress={showDatePicker}
          activeOpacity={0.9}
          style={[
            styles.inputWrapper,
            {
              backgroundColor:
                dateBirth?.length > 0 ? Theme.backgroundColor : '#FFF',
              borderColor: '#D8D8D8',
              borderWidth: 0.5,
            },
          ]}>
          <Text
            style={[
              CommonStyle.text12_inter_m,
              {color: dateBirth === DATE_FORMAT ? Theme.grey : Theme.black},
            ]}>
            {dateBirth}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={birthday}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        hidden={true}
        translucent={true}
        backgroundColor={'transparent'}
      />

      <AptoNavHeader
        onPressLeft={onPressLeft}
        leftIcon={Theme.arrow_left}
        title={'Personal information'}
        rightText={'Next'}
        onPressRight={onPressRight}
        isValid={isValid}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          bounces={'alwaysBounce'}>
          {InputLayout()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  body: {
    flex: 1,
    paddingHorizontal: PADDING_HOR,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 46,
  },
});

export default AptoPersonalBirthdayScreen;
