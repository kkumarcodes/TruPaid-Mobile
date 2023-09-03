import React from 'react';
import {View, StyleSheet, TextInput, Image, Text} from 'react-native';
import {Theme} from '../../styles/theme';
import {CommonStyle} from '../../styles';

const InputTruPaidCard = (props) => {
  const [focus, setFocus] = React.useState(false);

  return (
    <>
      <View style={[styles.inputWrapper, {
        backgroundColor: !focus ? '#F8F8F8' : '#FFF',
        borderColor: focus ? Theme.primary : '#F8F8F8',
        borderWidth: focus ? 1 : 1.4,
      }]}>
        {props?.leftIcon ?
          <View style={styles.leftIconWrapper}>
            <Image source={props?.leftIcon} style={{width: 21, height: 15, resizeMode: 'contain', tintColor: '#C2C2C2'}}/>
          </View>
          : null}

        <View style={{flex: 1, justifyContent: 'center'}}>
          {props?.header ?
            <View style={styles.header}>
              <Text style={[CommonStyle.text11_inter_r, {color: '#808080'}]}>
                {props?.header}
              </Text>
            </View>
            : null
          }

          <TextInput
            ref={props?.ref}
            {...props}
            style={styles.input}
            secureTextEntry={props?.secureTextEntry}
            placeholderTextColor={'#C2C2C2'}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            returnKeyType={'done'}
          />
        </View>

        {props?.rightIcon ?
          <View style={styles.rightIconWrapper}>
            <Image source={props?.rightIcon} style={[styles.rightIcon, {
              width: props?.rightIconWidth ? props?.rightIconWidth : 40,
              height: props?.rightIconHeight ? props?.rightIconHeight : 25,
            }]}/>
          </View>
          : null
        }
      </View>
      {props?.warning ?
        <Text style={[CommonStyle.text12_inter_r, {color: '#F44336', lineHeight: 18, paddingTop: 3}]}>
          {props?.warning}
        </Text>
        : null
      }
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 8,
    height: 56,
  },
  leftIconWrapper: {
    width: 32,
  },
  rightIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  rightIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    ...CommonStyle.text16_inter_r,
    letterSpacing: -0.3,
    color: Theme.black,
    paddingVertical: 0,
  },
});

export default InputTruPaidCard;
