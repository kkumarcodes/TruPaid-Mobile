import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {navigation} from '../../../routes/navigation';
import MainButton from '../../../components/main-button';
import BasicNavHeader from '../../../components/basic-nav-header';
import RBSheet from 'react-native-raw-bottom-sheet';

const MANAGEMENT_LIST = [
  {
    id: 1,
    title: 'Payment methods',
    description: 'View, add, remove payment methods to fund Reveel Card',
    icon: Theme.icon_pig,
  },
  {
    id: 2,
    title: 'Card details',
    description: 'View card number, expiration date and CVV',
    icon: Theme.icon_trupaid_card,
  },
  {
    id: 3,
    title: 'My data',
    description: 'Information associated with Reveel Card, including address, phone #, or email',
    icon: Theme.icon_user_data,
  },
];

const CARD_SETTING_LIST = [
  {
    id: 1,
    title: 'Security PIN',
    description: 'Reset Reveel Card security PIN',
    icon: Theme.icon_lock,
  },
  {
    id: 2,
    title: 'Notification',
    description: 'Your push and email notification preferences',
    icon: Theme.icon_bell,
  },
  {
    id: 3,
    title: 'Get a plastic Reveel card',
    description: '',
    icon: Theme.icon_bell,
  },
  {
    id: 4,
    title: 'Lock/unlock Reveel Card',
    description: '',
    icon: Theme.icon_user_lock,
  },
];


const ReveelCardManagementScreen = () => {
  const refRBSheet = useRef();

  useEffect(() => {

  }, []);

  const onPressAddFunds = () => {
    refRBSheet.current.open();
  };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={{marginTop: 24}}>
        <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: 30}}>
              <Image source={item.icon} style={styles.icon}/>
            </View>
            <Text style={[CommonStyle.text14_inter_m, {marginTop: -3}]}>
              {item.title}
            </Text>
          </View>

          <TouchableOpacity style={{paddingLeft: PADDING_HOR}}>
            <Image source={Theme.arrow_right}
                   style={styles.arrow}/>
          </TouchableOpacity>
        </View>

        <Text
          style={[CommonStyle.text12_inter_r, {color: Theme.grey, paddingLeft: 30, paddingTop: 3, lineHeight: 16.69}]}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSettingItem = (item) => {
    return (
      <TouchableOpacity style={{marginTop: 24}}>
        <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: 30}}>
              <Image source={item.icon} style={styles.icon}/>
            </View>
            <Text style={[CommonStyle.text14_inter_m, {marginTop: -3}]}>
              {item.title}
            </Text>
          </View>

          <TouchableOpacity style={{paddingLeft: PADDING_HOR}}>
            <Image source={Theme.arrow_right}
                   style={styles.arrow}/>
          </TouchableOpacity>
        </View>

        <Text
          style={[CommonStyle.text12_inter_r, {color: Theme.grey, paddingLeft: 30, paddingTop: 3, lineHeight: 16.69}]}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPlasticCardItem = (item) => {
    return (
      <TouchableOpacity style={{marginTop: 24}}>
        <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 30}}>
              <Image source={item.icon} style={styles.icon}/>
            </View>
            <Text style={[CommonStyle.text14_inter_m]}>
              {item.title}
            </Text>

            <View style={styles.btnNew}>
              <Text style={[CommonStyle.text12_inter_r, {color: Theme.white}]}>
                New
              </Text>
            </View>
          </View>

          <TouchableOpacity style={{paddingLeft: PADDING_HOR}}>
            <Image source={Theme.arrow_right}
                   style={styles.arrow}/>
          </TouchableOpacity>
        </View>

        <Text
          style={[CommonStyle.text12_inter_r, {color: Theme.grey, paddingLeft: 30, paddingTop: 3, lineHeight: 16.69}]}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLockCardItem = (item) => {
    return (
      <TouchableOpacity style={{marginTop: 24}}>
        <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 30}}>
              <Image source={item.icon} style={styles.icon}/>
            </View>
            <Text style={[CommonStyle.text14_inter_m, {color: '#F44336'}]}>
              {item.title}
            </Text>
          </View>

          <TouchableOpacity style={{paddingLeft: PADDING_HOR}}>
            <Image source={Theme.arrow_right}
                   style={styles.arrow}/>
          </TouchableOpacity>
        </View>

        <Text
          style={[CommonStyle.text12_inter_r, {color: Theme.grey, paddingLeft: 30, paddingTop: 3, lineHeight: 16.69}]}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const ManagementList = () => {
    return (
      <View style={{marginTop: 0}}>
        {MANAGEMENT_LIST.map((item, key) => {
          return (
            <View key={key}>
              {renderItem(item)}
            </View>
          );
        })}
      </View>
    );
  };

  const SettingList = () => {
    return (
      <View style={{marginTop: 30}}>
        <View>
          <Text style={[CommonStyle.text12_inter_m, {color: Theme.grey}]}>
            CARD SETTINGS
          </Text>
        </View>

        {CARD_SETTING_LIST.map((item, key) => {
          return (
            <View key={key}>
              {key < 2 && renderSettingItem(item)}
              {key === 2 && renderPlasticCardItem(item)}
              {key === 3 && renderLockCardItem(item)}
            </View>
          );
        })}
      </View>
    );
  };

  const BottomSheet = () => {
    return (
      <RBSheet
        closeOnDragDown={true}
        closeOnPressMask={true}
        ref={refRBSheet}
        height={213}
        openDuration={250}
        customStyles={{
          container: {
            borderRadius: 16,
            backgroundColor: Theme.white,
            width: WINDOW_WIDTH - 24,
            marginHorizontal: 12,
            marginBottom: 16,
          },
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.67)',
          },
          draggableIcon: {
            height: 1,
            display: 'none',
          },
        }}
      >
        <View style={{width: '100%', paddingHorizontal: PADDING_HOR, paddingTop: 20}}>
          <Text style={[CommonStyle.text17_inter_b, {letterSpacing: -0.3}]}>
            Add money
          </Text>

          <View style={styles.cardContainer}>
            <View style={[CommonStyle.row_bw, {paddingHorizontal: PADDING_HOR, alignItems: 'flex-start'}]}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                  setTimeout(() => {
                    navigation.navigate('ReveelCardAddMoney');
                  }, 200);
                }}
                style={{flex: 1}}
              >
                <Text style={[CommonStyle.text14_inter_m]}>Debit Card transfer</Text>
                <Text style={[CommonStyle.text12_inter_r, {color: Theme.grey, paddingTop: 1}]}>
                  Instant deposit with a debit card
                </Text>
              </TouchableOpacity>

              <Image source={Theme.arrow_right} style={[styles.arrow, {tintColor: Theme.grey, marginTop: 5}]}/>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={[CommonStyle.row_bw, {paddingHorizontal: PADDING_HOR, alignItems: 'flex-start'}]}>
              <TouchableOpacity onPress={() => console.log('aaaa')} style={{flex: 1}}>
                <Text style={[CommonStyle.text14_inter_m]}>Direct deposit (ACH)</Text>
                <Text style={[CommonStyle.text12_inter_r, {color: Theme.grey, paddingTop: 1}]}>
                  ACH transfer method from external account (2-3 days)
                </Text>
              </TouchableOpacity>
              <Image source={Theme.arrow_right} style={[styles.arrow, {tintColor: Theme.grey, marginTop: 5}]}/>
            </View>
          </View>

        </View>
      </RBSheet>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <BasicNavHeader
        leftIcon={Theme.arrow_left}
        title={'Reveel card management'}
        onPressLeft={onPressLeft}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView style={styles.body}
                    showsVerticalScrollIndicator={false}
        >

          <View style={{alignItems: 'center'}}>
            <Image source={Theme.trupaid_card_logo2} style={styles.imgLogo}/>
            <View style={styles.btnContainer}>
              <MainButton
                onPress={onPressAddFunds}
                title={'ADD FUNDS'}
                isValid={true}
              />
            </View>
          </View>

          {ManagementList()}

          {SettingList()}

          <View style={{height: 30}}/>
        </ScrollView>

      </KeyboardAvoidingView>

      {BottomSheet()}

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
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  arrow: {
    width: 6,
    height: 10,
    resizeMode: 'contain',
  },
  imgLogo: {
    width: 134,
    height: 89,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  btnNew: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 1,
    marginLeft: 10,
  },
  cardContainer: {
    borderWidth: 0.5,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    height: 64,
    marginTop: 10,
    justifyContent: 'center',
  },
});

export default ReveelCardManagementScreen;
