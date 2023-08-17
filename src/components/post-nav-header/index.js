import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Text, Image,
} from 'react-native';
import {CommonStyle} from '../../styles';
import {Theme} from '../../styles/theme';
import {PADDING_HOR} from '../../styles/constant';

const PostNavHeader = (props) => {
  return (
    <View style={styles.container}>

      <View style={[CommonStyle.row]}>
        <TouchableOpacity onPress={props?.onPressLeft} style={styles.btnWrapper}>
          <Image source={props?.leftIcon}
                 style={{width: 15, height: 15, resizeMode: 'contain', tintColor: Theme.white}}
          />
        </TouchableOpacity>

        {props?.title ?
          <View style={{paddingHorizontal: 25}}>
            <Text style={[CommonStyle.text16_inter_m, {color: Theme.white}]} numberOfLines={1}>
              {props?.title}
            </Text>
          </View>
          : null
        }

        {props?.rightText ?
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity style={CommonStyle.row}  onPress={props?.onPressRight}>
              <View>
                <Text style={[CommonStyle.text16_inter_m, {color: Theme.primary}]} numberOfLines={1}>
                  {props?.rightText}
                </Text>
              </View>
              {props?.rightIcon && <Image source={props?.rightIcon} style={{
                width: 18,
                height: 15,
                resizeMode: 'contain',
                tintColor: Theme.primary,
                marginLeft: 10
              }}/>}
            </TouchableOpacity>
          </View>
          : null
        }

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
    backgroundColor: '#2E2E2E',
  },
  btnWrapper: {
    padding: 10,
    margin: -10,
  },
  rightStyle: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    tintColor: Theme.black,
  },
});

export default PostNavHeader;
