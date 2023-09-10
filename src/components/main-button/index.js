import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { CommonStyle } from '../../styles';
import { Theme } from '../../styles/theme';

const MainButton = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btnWrapper, { backgroundColor: props?.isValid ? Theme.primary : '#F9D8D5' }]}
        activeOpacity={0.73}
        disabled={!props?.isValid}
        onPress={props?.onPress}
      >
        <Text style={[CommonStyle.text14_inter_m, { color: props?.isValid ? Theme.white : Theme.white }]}>
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
    // height: 48,
    backgroundColor: Theme.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
  },
});

export default MainButton
