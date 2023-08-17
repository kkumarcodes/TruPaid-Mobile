import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
  LogBox,
} from 'react-native';
import {GOOGLE_API_KEY} from "@env"
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT} from '../../../styles/constant';
import {navigation} from '../../../routes/navigation';
import AptoNavHeader from '../../../components/apto-nav-header';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {CommonStyle} from '../../../styles';
import {setAddress as setAptoAddress} from '../../../redux/actions/apto';

const AptoHomeAddressScreen = () => {
  const dispatch = useDispatch();
  const [isValid, setValid] = useState(false);
  const [address, setAddress] = useState('');
  const [addressData, setAddressData] = useState();
  const [focus, setFocus] = React.useState(false);

  useEffect(() => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
    ]);
  });

  useEffect(() => {
    setValid(address?.length > 2 && addressData);
  }, [address]);

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressRight = () => {
    if (addressData) {
      dispatch(setAptoAddress(addressData));
      navigation.navigate('AptoPersonalBirthday');
    }
  };

  const onChangeAddress = (text, data) => {
    setAddressData(data);
    setAddress(text);
  };

  const InputLayout = () => {
    return (
      <View style={{flex: 1, marginTop: 20, paddingHorizontal: PADDING_HOR}}>
        <Text
          style={[
            CommonStyle.text15_inter_r,
            {color: Theme.grey, lineHeight: 22},
          ]}>
          {
            'Please enter your permanent legal address.\nThis addewss will also be used for mailing purposes (i.e. sending physical card).'
          }
        </Text>

        <View style={{flex: 1, marginTop: 20}}>
          <Text style={[CommonStyle.text12_inter_m, {color: Theme.black}]}>
            Home address
          </Text>

          <View style={{height: 10}} />

          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            listViewDisplayed={true} // true/false/undefined
            fetchDetails={true}
            styles={{
              textInput: {
                height: 46,
                fontSize: 14,
                fontFamily: 'Inter-Regular',
                color: Theme.black,
                paddingHorizontal: PADDING_HOR,
                borderRadius: 8,
                borderColor: focus ? Theme.primary : '#D8D8D8',
                borderWidth: focus ? 1 : 0.5,
              },
            }}
            getDefaultValue={() => {
              return address; // text input default value
            }}
            onPress={(data, details = null) => {
              let street_one = '';
              let street_two = '';
              let postal_code = '';
              let locality = '';
              let region = '';
              let country = '';

              for (const component of details.address_components) {
                const componentType = component.types[0];

                switch (componentType) {
                  case 'street_number': {
                    street_one = `${component.long_name}`;
                    break;
                  }

                  case 'route': {
                    street_two = component.long_name;
                    break;
                  }

                  case 'postal_code': {
                    postal_code = `${component.long_name}${postal_code}`;
                    break;
                  }

                  case 'postal_code_suffix': {
                    postal_code = `${postal_code}-${component.long_name}`;
                    break;
                  }
                  case 'locality':
                    locality = component.long_name;
                    break;
                  case 'administrative_area_level_1': {
                    region = component.short_name;
                    break;
                  }

                  case 'country':
                    country = component.short_name;
                    break;
                }
              }
              const address = {
                street_one,
                street_two,
                locality,
                region,
                postal_code,
                country,
              };

              onChangeAddress(data.description, address);
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            currentLocation={false}
            currentLocationLabel="Current location"
            textInputProps={{
              returnKeyType: 'done',
              value: address,
              onChangeText: text => onChangeAddress(text, null),
              onFocus: () => setFocus(true),
              onBlur: () => setFocus(false),
            }}
          />
        </View>
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
        title={'Enter your home address'}
        rightText={'Next'}
        onPressRight={onPressRight}
        isValid={isValid}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        style={{flex: 1}}>
        {InputLayout()}

        <View style={{height: WINDOW_HEIGHT - 400}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
});

export default AptoHomeAddressScreen;
