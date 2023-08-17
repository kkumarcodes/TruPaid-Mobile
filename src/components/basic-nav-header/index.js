import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Text, Image,
} from 'react-native';
import {CommonStyle} from '../../styles';
import {Theme} from '../../styles/theme';
import {PADDING_HOR} from '../../styles/constant';

const BasicNavHeader = (props) => {
  return (
    <View style={styles.container}>

      <View style={[CommonStyle.row]}>
        <TouchableOpacity onPress={props?.onPressLeft} style={styles.btnWrapper}>
          <Image source={props?.leftIcon}
                 style={{width: 18, height: 15, resizeMode: 'contain', tintColor: Theme.black}}
          />
        </TouchableOpacity>

        {props?.title ?
        <View style={{paddingHorizontal: 25}}>
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
    margin: -10,
  },
  rightStyle: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    tintColor: Theme.black
  }
});

export default BasicNavHeader;
