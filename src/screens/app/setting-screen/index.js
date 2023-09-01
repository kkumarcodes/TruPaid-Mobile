import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, TouchableOpacity, Image, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import {CommonStyle} from '../../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadSignUp} from '../../../redux/actions/auth';
import {updateBankAccount} from '../../../redux/actions/plaid';
import DeviceInfo from 'react-native-device-info';

const SettingScreen = (props) => {
  const dispatch = useDispatch();
  const user_info = useSelector(state => state?.auth?.user_info);
  const [version, setVersion] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [codePushVersion, setCodePushVersion] = useState('');

  useEffect(() => {
    const buildNumber = DeviceInfo.getBuildNumber();
    const version = DeviceInfo.getVersion();
    setVersion(version);
    setBuildNumber(buildNumber);

  }, []);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressLogout = async () => {
    await AsyncStorage.removeItem('@trupaid_email');
    await AsyncStorage.removeItem('@trupaid_password');

    // await analytics().logEvent('log_out', {
    //   id: user_info?.session?.identity?.id,
    // });

    dispatch(updateBankAccount([]));
    dispatch(loadSignUp());
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        title={'Settings'}
        leftIcon={Theme.arrow_left}
        onPressLeft={onPressLeft}
      />

      <View style={styles.body}>
        <TouchableOpacity style={CommonStyle.row}
                          onPress={() => onPressLogout()}
        >
          <Image source={Theme.icon_logout} style={styles.icon}/>
          <Text style={[CommonStyle.text14_inter_m, {color: Theme.primary, paddingLeft: 12}]}>
            Logout
          </Text>
        </TouchableOpacity>

        <View style={[CommonStyle.row, {marginTop: 20}]}>
          <Text style={[CommonStyle.text14_inter_m, {color: Theme.grey}]}>
            {'Version ' + version + ' (' + buildNumber + ')'}
          </Text>
        </View>
        {codePushVersion ?
          <View style={[CommonStyle.row, {marginTop: 20}]}>
            <Text style={[CommonStyle.text14_inter_m, {color: Theme.grey}]}>
              {'CodePush Version ' + codePushVersion}
            </Text>
          </View>
          : null
        }
      </View>

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
    paddingTop: 30,
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default SettingScreen;
