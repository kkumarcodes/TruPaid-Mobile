import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {PlaidLink, usePlaidEmitter, LinkEvent, LinkExit, LinkSuccess} from 'react-native-plaid-link-sdk';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Theme} from '../../../styles/theme';
import {CommonStyle} from '../../../styles';
import {useDispatch} from 'react-redux';
import {setApiLoading} from '../../../redux/actions/config';
import {setPlaidAccessToken} from '../../../redux/actions/plaid';
import {useLazyQuery} from '@apollo/client';
import {GET_ACCESS_TOKEN} from '../../../utils/Query';

const AppButton = (props) => {
  return <View style={styles.appButtonContainer}>
    <Text style={[CommonStyle.text14_inter_m, {color: Theme.white}]}>{props?.title}</Text>
  </View>;
};

const PlaidLinkScreen = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [publicToken, setPublicToken] = useState(null);
  const [institution, setInstitution] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [getAccessToken, {data: accessTokenData, loading, error}] = useLazyQuery(GET_ACCESS_TOKEN, {
    variables: {
      publicToken,
    },
  });

  useEffect(() => {
    dispatch(setApiLoading(loading));
  }, [loading]);

  useEffect(() => {
    if (publicToken) {
      getAccessToken();
    }
  }, [publicToken]);

  useEffect(() => {
    if (accessTokenData) {
      console.log('access token: ', accessTokenData);
      dispatch(setPlaidAccessToken(accessTokenData?.exchangePlaidPublicToken?.accessToken));

      const item = {
        'itemId': accessTokenData?.exchangePlaidPublicToken?.itemId,
        'accessToken': accessTokenData?.exchangePlaidPublicToken?.accessToken,
        'institution': institution,
        'accounts': accounts,
      };
      let items = [];
      items.push(item);
      navigation.goBack();
      navigation.navigate('AddPaymentMethod', {items});
    }
  }, [accessTokenData]);

  usePlaidEmitter((event: LinkEvent) => {
    console.log(event);
  });

  return (
    <View style={{flex: 1}}>

      <View style={styles.bottom}>

        <PlaidLink
          tokenConfig={{
            token: props?.linkToken,
          }}

          onSuccess={(success: LinkSuccess) => {

            setPublicToken(success?.publicToken);

            const body = {
              public_token: success?.publicToken,
              accounts: success?.metadata.accounts,
              institution: success?.metadata.institution,
              linkSessionId: success?.metadata.linkSessionId,
            };

            setInstitution({
              'institutionId': success?.metadata.institution?.id,
              'name': success?.metadata.institution?.name,
            });

            let accounts = [];
            Array.isArray(success.metadata.accounts) && success.metadata.accounts.map(account => {
              const newAccount = {
                accountId: account.id,
                name: account.name,
                type: account.type,
                subtype: account.subtype,
                mask: account.mask,
              };
              accounts.push(newAccount);
            });
            setAccounts(accounts);
          }}

          onExit={(exit: LinkExit) => {
            Toast.show({
              type: 'toast_custom_type',
              text1: '',
              text2: 'something error to get public token',
              visibilityTime: 2000,
            });
            console.log(exit);
          }}
        >
          <AppButton title="Add bank account"/>
        </PlaidLink>
      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 0,
    backgroundColor: Theme.primary,
    width: '100%',
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});

export default PlaidLinkScreen;
