import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Text, Image,
} from 'react-native';
import {CommonStyle} from '../../styles';
import {Theme} from '../../styles/theme';
import {PADDING_HOR} from '../../styles/constant';

const ProfileNavHeader = (props) => {
  return (
    <View style={styles.container}>

      <View style={[CommonStyle.row]}>
        {props?.title ?
        <View style={{paddingHorizontal: 0}}>
          <Text style={CommonStyle.text16_inter_m} numberOfLines={1}>
            {props?.title}
          </Text>
        </View>
          : null
        }

        <View style={{flex: 1, alignItems: 'flex-end'}}>
          {props.rightIcon ?
            <TouchableOpacity onPress={props?.onPressRight} style={styles.btnWrapper}>
              <Image source={props?.rightIcon} style={styles.rightStyle}/>
            </TouchableOpacity>
            : <View/>
          }
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    justifyContent: 'flex-end',
    paddingBottom: 12,
    paddingHorizontal: PADDING_HOR,
  },
  btnWrapper: {
    padding: 10,
    margin: -10
  },
  rightStyle: {
    width: 22,
    height: 17,
    resizeMode: 'contain',
  }
});

export default ProfileNavHeader;
