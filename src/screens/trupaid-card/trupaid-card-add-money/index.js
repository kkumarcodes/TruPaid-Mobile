import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import TopNavHeader from '../../../components/top-nav-header';
import {CommonStyle} from '../../../styles';
import MainButton from '../../../components/main-button';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  pushFundsPaymentSource,
  getPaymentSources,
  RetriveFundingSource,
} from '../../../utils/ApiAptoKit';
import {setPaymentSource as setPaymentSourceRedux} from '../../../redux/actions/apto';

const TruPaidCardAddMoneyScreen = () => {
  const issueCard = useSelector(state => state?.apto?.issueCard);
  const [money, setMoney] = useState('');
  const [paymentSource, setPaymentSource] = useState();
  const [allPaymentSources, setAllPaymentSources] = useState([]);
  const aptoPaymentSource = useSelector(state => state.apto.paymentSource);

  const textRef = useRef();
  const refRBSheet = useRef();

  useEffect(() => {
    setTimeout(() => {
      textRef.current.focus();
    }, 100);
    getAllPaymentSources();
  }, []);

  const getAllPaymentSources = async () => {
    try {
      const res = await getPaymentSources();
      
      setAllPaymentSources(res.data.payment_sources);
      if (res.data.payment_sources.length > 0) {
        setPaymentSource(res.data.payment_sources[0].payment_source)
      }
    } catch (error) {
      navigation.navigate('AptoInputPhone');
    }
  }

  useEffect(() => {
    if (aptoPaymentSource) {
      setPaymentSource(aptoPaymentSource)
    }
  }, [aptoPaymentSource])

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onChangeMoney = (text) => {
    let nexText = text.replace(/[^0-9]/g, '');
    let newNumber = parseInt(nexText);
    if (isNaN(newNumber)) {
      newNumber = '';
    }
    setMoney(newNumber.toString());
  };

  const InputMoney = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <TextInput
          ref={textRef}
          selectionColor={Theme.primary}
          style={{
            ...CommonStyle.text42_inter_m,
            height: 90,
            width: '100%',
            textAlign: 'center',
          }}
          keyboardType={'numeric'}
          placeholder={'$0'}
          maxLength={10}
          onChangeText={onChangeMoney}
          value={money}
          returnKeyType={'done'}
        />
      </View>
    );
  };

  const onPressNext = async () => {
    try {
      
      const resBalance = await RetriveFundingSource(issueCard.account_id)
      console.log(JSON.stringify(resBalance.data), '==RetriveFundingSource=')
      await pushFundsPaymentSource(paymentSource.id, {
        amount: parseFloat(money),
        balance_id: resBalance.data.id,
      })
      navigation.navigate('TruPaidCardSuccess', {amount: money});
    } catch (error) {
      console.log(JSON.stringify(error))
      let message = '';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      } else {
        message = 'add balance failed';
      }

      Toast.show({
        type: 'toast_custom_type',
        text1: '',
        text2: message,
        visibilityTime: 3000,
      });
    }
    
  };

  const addNewCardHandler = () => {
    refRBSheet.current.close()
    navigation.navigate('TruPaidCardAddNew');
  }

  const selectCardHandler = (index) => {
    console.log(index)
    setPaymentSourceRedux(allPaymentSources[index].payment_source)
    setPaymentSource(allPaymentSources[index].payment_source)
    refRBSheet.current.close()
  }

  const NoPaymentMethodCard = () => {
    return (
      <View style={[styles.inputWrapper]}>
        <View style={CommonStyle.row}>
          <View style={styles.iconWrapper}>
            <Image source={Theme.icon_trupaid_card2} style={{width: 26, height: 17.88, resizeMode: 'contain'}}/>
          </View>
          <Text style={[CommonStyle.text14_inter_m, {paddingLeft: 16}]}>
            No payment method
          </Text>
        </View>
        <TouchableOpacity
          style={styles.rightIconWrapper}
          onPress={() => navigation.navigate('TruPaidCardAddNew')}
        >
          <Text style={[CommonStyle.text14_inter_m, {color: Theme.primary}]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const MainTruPaidCard = (paymentSource) => {

    return (
      <View style={[styles.inputWrapper]}>
        <View style={CommonStyle.row}>
          <View style={styles.iconWrapper}>
            <Image source={Theme.card_trademark} style={{width: 34, height: 21, resizeMode: 'contain'}}/>
          </View>
          <View style={{paddingLeft: 16}}>
            <Text style={[CommonStyle.text14_inter_m]}>
              ***{paymentSource.last_four}
            </Text>
            <Text style={[CommonStyle.text11_inter_r, {color: Theme.grey}]}>
              {paymentSource.card_network}
            </Text>
          </View>

        </View>
        <TouchableOpacity
          style={styles.rightIconWrapper}
          onPress={() => refRBSheet.current.open()}
        >
          <Text style={[CommonStyle.text14_inter_m, {color: Theme.primary}]}>
            Change card
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const PaymentMethodCard = (source, index) => {
    return (
      <TouchableOpacity style={[styles.inputPaymentWrapper]} onPress={() => selectCardHandler(index)}>
        <View style={CommonStyle.row}>
          <View style={styles.iconWrapper}>
            <Image source={Theme.card_trademark} style={{width: 34, height: 21, resizeMode: 'contain'}}/>
          </View>
          <View style={{paddingLeft: 16}}>
            <Text style={[CommonStyle.text14_inter_m]}>
              ***{source.payment_source.last_four}
            </Text>
            <Text style={[CommonStyle.text11_inter_r, {color: Theme.grey}]}>
              {source.payment_source.card_network}
            </Text>
          </View>

        </View>

        <View>
          <Image source={Theme.icon_check_fill} style={{width: 24, height: 24, resizeMode: 'contain'}}/>
        </View>
      </TouchableOpacity>
    );
  };

  const AddPaymentCard = () => {
    return (
      <TouchableOpacity style={[styles.inputPaymentWrapper]} onPress={addNewCardHandler}>
        <View style={CommonStyle.row}>
          <View style={styles.iconWrapper}>
            <Image source={Theme.icon_trupaid_card2} style={{width: 34, height: 21, resizeMode: 'contain'}}/>
          </View>
          <View style={{paddingLeft: 16}}>
            <Text style={[CommonStyle.text14_inter_m]}>
              Add new card
            </Text>
            <Text style={[CommonStyle.text11_inter_r, {color: Theme.grey}]}>
              Debit card
            </Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  };

  const BottomSheet = (allPaymentSources) => {
    return (
      <RBSheet
        closeOnDragDown={true}
        closeOnPressMask={true}
        ref={refRBSheet}
        height={WINDOW_HEIGHT - 80}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: Theme.white,
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
        <ScrollView style={{width: '100%', paddingHorizontal: PADDING_HOR, paddingTop: 10}}>

          <TouchableOpacity
            style={{padding: 10, alignSelf: 'flex-start'}}
            onPress={() => refRBSheet.current.close()}
          >
            <Image source={Theme.icon_close_w}
                   style={{width: 16, height: 16, resizeMode: 'contain', tintColor: Theme.black}}/>
          </TouchableOpacity>

          <View style={{height: 10}}/>
          {allPaymentSources.map((source, index) => {
            return PaymentMethodCard(source, index)
          })}
          {AddPaymentCard()}

        </ScrollView>
      </RBSheet>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

      <TopNavHeader
        leftIcon={Theme.arrow_left}
        title={'Add money'}
        onPressLeft={onPressLeft}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView style={styles.body}
                    showsVerticalScrollIndicator={false}
        >

          <View style={{marginTop: (WINDOW_HEIGHT - 100) * 0.2}}>
            {InputMoney()}
          </View>

          <View style={{marginTop: (WINDOW_HEIGHT - 100) * 0.1}}>
            {allPaymentSources.length === 0 && NoPaymentMethodCard()}
            {paymentSource && MainTruPaidCard(paymentSource)}
          </View>
        </ScrollView>

        {allPaymentSources &&
        <View style={[styles.btnContainer]}
        >
          <MainButton
            title={'Add money'}
            isValid={Number(money) > 0}
            onPress={onPressNext}
          />
        </View>
        }
      </KeyboardAvoidingView>

      {BottomSheet(allPaymentSources)}

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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: PADDING_HOR,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#D6D6D6',
    height: 64,
  },
  rightIconWrapper: {
    padding: PADDING_HOR,
  },
  inputPaymentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    borderBottomColor: '#E9E9E9',
    borderBottomWidth: 1,
    marginBottom: 1,
  },
});

export default TruPaidCardAddMoneyScreen;
