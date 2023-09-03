import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {CommonStyle} from '../styles';

const OtpTextInput = function (props) {
  const {
    containerStyle,
    style,
    LeftComponent,
    RightComponent,
    refCallback,
    editable,
    secureTextEntry,
    value,
    ...remainingProps
  } = props;

  return (
    <View style={[styles.containerStyle, containerStyle, {
      borderWidth: value ? 1 : 0,
      backgroundColor: value ? 'white' : '#F8F8F8',
    }]}>
      <TextInput
        {...remainingProps}
        style={[styles.textInputStyle, style, CommonStyle.text20_inter_m]}
        ref={refCallback}
        editable={editable}
        secureTextEntry={secureTextEntry}
        autoCapitalize={'none'}
        placeholder={'0'}
        placeholderTextColor={'#DEDEDE'}
      />
      <View style={styles.horzLine}/>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
  },
  textInputStyle: {
    flex: 1,
    padding: 0,
    textAlign: 'center',
  },
  horzLine: {
    flex: 1,
    position: 'absolute',
    width: 22,
    height: 1,
    backgroundColor: '#C4C4C4',
    bottom: 15,
    alignSelf: 'center',
  },
});

OtpTextInput.defaultProps = {
  LeftComponent: <></>,
  RightComponent: <></>,
};

OtpTextInput.propTypes = {
  containerStyle: PropTypes.any,
  style: PropTypes.any,
  LeftComponent: PropTypes.object,
  RightComponent: PropTypes.object,
  refCallback: PropTypes.func,
};

export default OtpTextInput;
