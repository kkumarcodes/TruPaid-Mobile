import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Text, Image,
} from 'react-native';
import {CommonStyle} from '../../styles';
import {Theme} from '../../styles/theme';
import {PADDING_HOR} from '../../styles/constant';

const TopNavHeader = (props) => {
  return (
    <View style={styles.container}>

      <View style={[CommonStyle.row_bw]}>
        <TouchableOpacity onPress={props?.onPressLeft} style={styles.btnWrapper}>
          <Image source={props?.leftIcon}
                 style={{width: 18, height: 15, resizeMode: 'contain', tintColor: '#000'}}
          />
        </TouchableOpacity>

        {props?.title &&
        <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 10}}>
          <Text style={CommonStyle.text16_inter_m} numberOfLines={1}>
            {props?.title}
          </Text>
        </View>
        }

        <View style={{alignItems: 'flex-end'}}>
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
    backgroundColor: Theme.white,
    paddingHorizontal: PADDING_HOR,
  },
  btnWrapper: {
    padding: 10,
    margin: -10,
  },
  rightStyle: {
    width: 17,
    height: 20,
    resizeMode: 'contain',
  }
});

export default TopNavHeader;
