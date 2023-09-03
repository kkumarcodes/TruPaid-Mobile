import React from 'react';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
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
import {useMutation} from '@apollo/client';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import MainButton from '../../../components/main-button';
import MainOutlineButton from '../../../components/main-outline-button';
import { cardproducts, cardApply, cardStatus, acceptAgreement, setAgreementStatus, issueCard } from '../../../utils/ApiAptoKit';
import {setApiLoading} from '../../../redux/actions/config';
import {POST_APTO_AGREEMENT, POST_APTO_CARD} from '../../../utils/Query';
import {setIssueCard,} from '../../../redux/actions/apto';

const AGREEMENT_LIST = [
  {
    id: 1,
    type: 'Cardholder',
    title: 'Cardholder Agreement',
  },
  {
    id: 2,
    type: 'AccountTerms',
    title: 'Eveolve Bank & Trust Customer Account Terms',
  },
  {
    id: 3,
    type: 'AptoPolicy',
    title: 'Apto Privacy Policy',
  },
  {
    id: 4,
    type: 'EvolveBankPolicy',
    title: 'Evolve Bank & Trust Privacy Policy',
  },
  {
    id: 5,
    type: 'E-Signature',
    title: 'E-Signature and Electronic Disclosure Agreement',
  },
];

const AptoLegalAgreementScreen = () => {
  const dispatch = useDispatch();

  const [
    postAptoAgreement,
    {data: agreementData, loading: agreementLoading, error: agreementError},
  ] = useMutation(POST_APTO_AGREEMENT);
  const [
    postAptoCard,
    {data: cardData, loading: cardLoading, error: cardError},
  ] = useMutation(POST_APTO_CARD);

  const onPressAccept = async () => {
    dispatch(setApiLoading(true));

    try {
      await AptoProcess();
      dispatch(setApiLoading(false));
    } catch (error) {
      let message = '';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      } else {
        message = 'create user failed';
      }

      Toast.show({
        type: 'toast_custom_type',
        text1: '',
        text2: message,
        visibilityTime: 3000,
      });
      dispatch(setApiLoading(false));
    }
  };

  const AptoProcess = async () => {
    const card = await applyCardHandler();

    if (card) {
      await acceptAgreementHandler();
      await issueCardHandler(card.id);
    }
  };

  const applyCardHandler = async () => {
    let cardProducts = [];
    // get cardproduct list
    let res = await cardproducts()
    cardProducts = res.data.data;

    // card apply
    if (cardProducts.length > 0) {

      res = await cardApply(cardProducts[0].id);
      let appliedCard = res.data;

      // card status
      res = await cardStatus(appliedCard.id)
      let status = res.data;

      if (status.next_action.action_type === 'collect_user_data') {
        return appliedCard;
      } else if (
        status.next_action.action_type === 'select_balance_store'
      ) {
        Toast.show({
          type: 'toast_custom_type',
          text1: '',
          text2: 'Select balance store',
          visibilityTime: 3000,
        });
        return null;
      } else if (status.next_action.action_type === 'issue_card') {
        return appliedCard;
      } else if (status.next_action.action_type === 'show_disclaimer') {
        await acceptAgreement(appliedCard.workflow_object_id, appliedCard.next_action.action_id);
        return appliedCard;
      } else {
        return null;
      }
    }
    return null;
  };

  const acceptAgreementHandler = async () => {
    // Agreements
    let res = await setAgreementStatus();
    await res.data.user_agreements.forEach(async user_agreement => {
      await postAptoAgreement({
        variables: {
          payload: {
            agreementId: user_agreement.user_agreement.id,
            agreementKey: user_agreement.user_agreement.agreement_key,
            userAction: user_agreement.user_agreement.action,
            recordedAt: user_agreement.user_agreement.recorded_at,
          },
        },
      });
    });
  };

  const issueCardHandler = async application_id => {
    const res = await issueCard(application_id)
    let issuedCard = res.data;
    dispatch(setIssueCard(issuedCard));

    const _data = {
      variables: {
        payload: {
          accountId: issuedCard.account_id,
          lastFour: issuedCard.last_four,
          cardNetwork: issuedCard.card_network,
          cardBrand: issuedCard.card_brand ? issuedCard.card_brand : '',
          cardIssuer: issuedCard.card_issuer,
          nameOnCard: issuedCard.name_on_card,
          expiration: issuedCard.expiration ? issuedCard.expiration : '',
          panToken: issuedCard.pan ? issuedCard.pan : '',
          cvvToken: issuedCard.cvv ? issuedCard.cvv : '',
          status: issuedCard.state,
          kycStatus: issuedCard.kyc_status,
          kycReason:
            issuedCard.kyc_reason.length > 0 ? issuedCard.kyc_reason[0] : '',
          balances: `${issuedCard.total_balance.amount}`,
          orderedStatus: issuedCard.ordered_status,
          cardholderFirstName: issuedCard.cardholder_first_name,
          cardholderLastName: issuedCard.cardholder_last_name,
          issuedAt: issuedCard.issued_at,
          waitList: issuedCard.wait_list,
          cardProductId: issuedCard.card_product_id,
          metadata: issuedCard.metadata,
          cardStyle: JSON.stringify(issuedCard.card_style),
          features: JSON.stringify(issuedCard.features),
        },
      },
    };
    await postAptoCard(_data);

    navigation.navigate('AptoSuccess');
  };
  const onPressDecline = () => {
    navigation.navigate('TruPaidCard');
  };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const renderItem = item => {
    return (
      <TouchableOpacity style={[CommonStyle.row_bw, styles.cardWrapper]}>
        <View style={{flex: 1}}>
          <Text style={CommonStyle.text15_inter_r}>{item.title}</Text>
        </View>

        <TouchableOpacity style={{paddingLeft: PADDING_HOR}}>
          <Image source={Theme.arrow_right} style={styles.arrow} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const AgreementList = () => {
    return (
      <View style={{marginTop: 10}}>
        {AGREEMENT_LIST.map((item, key) => {
          return <View key={key}>{renderItem(item)}</View>;
        })}
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

      <TopNavHeader onPressLeft={onPressLeft} leftIcon={Theme.arrow_left} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text
            style={[
              CommonStyle.text27_inter_m,
              {color: Theme.black, paddingVertical: 10},
            ]}>
            Legal agreement
          </Text>

          <Text
            style={[
              CommonStyle.text15_inter_r,
              {color: Theme.black, lineHeight: 22},
            ]}>
            Please carefully review all the documents listed before you proceed.
          </Text>

          {AgreementList()}

          <View style={{height: 20}} />
        </ScrollView>

        <View style={styles.btnContainer}>
          <MainButton onPress={onPressAccept} title={'Accept'} isValid={true} />
          <MainOutlineButton
            onPress={onPressDecline}
            title={'Decline'}
            isValid={true}
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
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    marginBottom: 30,
    paddingTop: 10,
    alignSelf: 'center',
  },
  cardWrapper: {
    height: 64,
    borderBottomColor: 'rgba(196, 196, 196, 0.25)',
    borderBottomWidth: 1,
  },
  arrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Theme.primary,
  },
});
/**
 * {
    "type": "user",
    "user_id": "crdhldr_a1909537c718292adb7b",
    "user_token": "ySJj4uEaZzqswcjIFGpp65nZMG1FK8OM8NMWOTUvUFIBPiRH8bd/dYKotQkBiILVVqtUUqYolX25iMypJaxABmFJPsgONBzVbsuSKqpx9cg=",
    "user_data": {
        "type": "list",
        "data": [
            {
                "type": "phone",
                "country_code": "1",
                "phone_number": "5642025946",
                "verified": true,
                "not_specified": false,
                "verification": null
            },
            {
                "type": "email",
                "email": "andriiivanytskyi@gmail.com",
                "verified": false,
                "not_specified": false,
                "verification": null
            },
            {
                "type": "name",
                "first_name": "Andrii",
                "last_name": "Ivanytskyi",
                "verified": false,
                "not_specified": false
            },
            {
                "type": "address",
                "address_id": "entity_2bfe73a034b07669",
                "street_one": "515 W 7th St",
                "street_two": "",
                "locality": "Los Angeles",
                "region": "CA",
                "postal_code": "90014",
                "country": "US",
                "primary": true,
                "verified": false,
                "not_specified": false
            },
            {
                "type": "birthdate",
                "date": "1990-11-03",
                "verified": false,
                "not_specified": false,
                "verification": null
            }
        ],
        "page": 0,
        "rows": 5,
        "has_more": false,
        "total_count": 5
    },
    "metadata": "example_meta"
}
 */
export default AptoLegalAgreementScreen;
