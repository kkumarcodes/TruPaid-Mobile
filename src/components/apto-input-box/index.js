import React from 'react';
import { View, StyleSheet, TextInput, Image, Text } from 'react-native';
import { Theme } from '../../styles/theme';
import { CommonStyle } from '../../styles';

const AptoInputBox = (props) => {
  const [focus, setFocus] = React.useState(false);

  return (
    <>
      {props?.title ?
        <Text style={[CommonStyle.text12_inter_m, { color: Theme.black, paddingBottom: 8 }]}>
          {props?.title}
        </Text>
        : null
      }
      <View style={[styles.inputWrapper, {
        backgroundColor: !focus && props.value?.length > 0 ? Theme.backgroundColor : '#FFF',
        borderColor: focus ? Theme.primary : '#D8D8D8',
        borderWidth: focus ? 1 : 0.5,
      }]}>
        {props?.leftIcon ?
          <View style={styles.iconWrapper}>
            <props.leftIcon />
          </View>
          : null}
        <TextInput
          ref={props?.ref}
          {...props}
          style={styles.input}
          secureTextEntry={props?.secureTextEntry}
          placeholderTextColor={Theme.placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          returnKeyType={'done'}
        />
        {props?.rightIcon ?
          <View style={styles.rightIconWrapper}>
            <Image source={props?.rightIcon} style={[styles.rightIcon, {
              width: props?.rightIconWidth ? props?.rightIconWidth : 40,
              height: props?.rightIconHeight ? props?.rightIconHeight : 25,
            }]} />
          </View>
          : null
        }
      </View>
      {props?.warning ?
        <Text style={[CommonStyle.text12_inter_r, { color: '#F44336', lineHeight: 18, paddingTop: 3 }]}>
          {props?.warning}
        </Text>
        : null
      }
      {props?.header && focus ?
        <View style={styles.header}>
          <Text style={[CommonStyle.text12_inter_m, { color: Theme.primary }]}>
            {props?.header}
          </Text>
        </View>
        : null
      }
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: -10,
    left: 15,
    backgroundColor: Theme.white,
    paddingHorizontal: 5
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 46,
  },
  iconWrapper: {},
  rightIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  rightIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    width: '100%',
    height: 46,
    ...CommonStyle.text15_inter_r,
    letterSpacing: -0.3,
    color: Theme.black,
    paddingLeft: 10,
  },
});

export default AptoInputBox;
