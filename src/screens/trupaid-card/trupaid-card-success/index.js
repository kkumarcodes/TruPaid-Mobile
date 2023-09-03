import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import TopNavHeader from '../../../components/top-nav-header';
import MainButton from '../../../components/main-button';
import {CommonStyle} from '../../../styles';
import {numberWithCommas} from '../../../styles/global';

const TruPaidCardSuccessScreen = (props) => {
  const amount = props.route.params?.amount;

  const onPressLeft = () => {
    navigation.navigate('TruPaidCard');
  };

  const onPressDone = () => {
    navigation.navigate('TruPaidCard');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        leftIcon={Theme.icon_close_w}
        onPressLeft={onPressLeft}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <View style={styles.body}>
          <Image source={Theme.icon_check_green} style={styles.icon}/>
          <Text style={[CommonStyle.text14_inter_r, {color: Theme.grey, paddingVertical: 10}]}>
            Success!
          </Text>
          <Text style={[CommonStyle.text20_inter_m, {letterSpacing: -0.3}]}>
            {'You deposited $'}{(numberWithCommas(Number(amount).toFixed(2))).toString()}
          </Text>
        </View>

        <View style={[styles.btnContainer]}>
          <MainButton
            title={'Done'}
            isValid={true}
            onPress={onPressDone}
          />
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
  icon: {
    width: 43,
    height: 43,
    resizeMode: 'contain',
  },
});

export default TruPaidCardSuccessScreen;
