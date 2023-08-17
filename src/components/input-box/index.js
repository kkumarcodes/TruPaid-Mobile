import React from 'react';
import {View, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import {Theme} from '../../styles/theme';

const InputBox = (props) => {
  const [focus, setFocus] = React.useState(false);

  return (
    <View style={[styles.inputWrapper, {
      backgroundColor: focus ? '#F4F4F4' : 'rgba(255, 255, 255, 1)',
      borderColor: focus ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.14)',
      borderWidth: 1,
    }]}>
      {props?.leftIcon ?
        <View style={styles.iconWrapper}>
          <props.leftIcon/>
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
        <TouchableOpacity style={styles.rightIconWrapper}
                          onPress={props?.onPressRight}
        >
          <Image source={props?.rightIcon} style={[styles.rightIcon, {
            width: 25,
            height: 25,
          }]}/>
        </TouchableOpacity>
        : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 3,
    height: 46,
  },
  iconWrapper: {},
  rightIconWrapper: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
    color: Theme.black,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    paddingLeft: 10,
  },
});

export default InputBox;
