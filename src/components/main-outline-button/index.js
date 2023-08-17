import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {CommonStyle} from '../../styles';
import {Theme} from '../../styles/theme';

const MainOutlineButton = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btnWrapper, {backgroundColor: props?.isValid ? Theme.white : Theme.white, height: props?.height ? props?.height : 48}]}
        activeOpacity={0.73}
        disabled={!props?.isValid}
        onPress={props?.onPress}
      >
        <Text style={[CommonStyle.text14_inter_r, {color: props?.isValid ? Theme.black : Theme.greyIcon}]}>
          {props?.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  btnWrapper: {
    height: 48,
    backgroundColor: Theme.white,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainOutlineButton
