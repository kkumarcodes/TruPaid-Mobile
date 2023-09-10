import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Text, Image,
} from 'react-native';
import { CommonStyle } from '../../styles';
import { Theme } from '../../styles/theme';
import { PADDING_HOR } from '../../styles/constant';
import { Platform } from 'react-native';

const FeedNavHeader = (props) => {
  return (
    <View style={styles.container}>

      <View style={[CommonStyle.row_bw]}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={props?.onPressLeft} style={[styles.profileWrapper]}>
            {props?.leftIcon ? <Image source={{ uri: props?.leftIcon }} style={styles.profile} /> : null}
            <View style={styles.notifyWrapper} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 5, alignItems: 'center', paddingHorizontal: 10 }}>
          <Text style={styles.textTitle} numberOfLines={1}>
            {props?.title}
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {props.rightIcon ?
            <TouchableOpacity onPress={props?.onPressRight} style={styles.btnWrapper}>
              <Image source={props?.rightIcon} style={styles.btnPlus} />
            </TouchableOpacity>
            : <View style={{ flex: 1 }} />
          }
        </View>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    justifyContent: 'center',
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
    height: Platform.OS === 'ios' ? 80 : 60,
  },
  textTitle: {
    fontSize: 20,
    fontFamily: 'TestPitchSans-Bold',
    lineHeight: 24.4,
    color: Theme.black,
  },
  profileWrapper: {
    width: 38,
    height: 38,
    backgroundColor: Theme.white,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profile: {
    width: 38,
    height: 38,
    resizeMode: 'cover',
  },
  notifyWrapper: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#FF5C00',
    borderColor: Theme.white,
    borderWidth: 2,
  },
  btnWrapper: {

  },
  btnPlus: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  }
});

export default FeedNavHeader;
