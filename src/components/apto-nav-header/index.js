import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Text, Image,
} from 'react-native';
import { CommonStyle } from '../../styles';
import { Theme } from '../../styles/theme';
import { PADDING_HOR } from '../../styles/constant';

const AptoNavHeader = (props) => {
  return (
    <View style={styles.container}>

      <View style={[CommonStyle.row_bw]}>
        <View style={{ flex: 1, alignItems: 'flex-start', paddingHorizontal: 0 }}>
          <TouchableOpacity onPress={props?.onPressLeft} style={styles.btnWrapper}>
            <Image source={props?.leftIcon}
              style={{ width: 18, height: 15, resizeMode: 'contain', tintColor: '#575757' }}
            />
          </TouchableOpacity>
        </View>


        <View style={{ flex: 5, alignItems: 'center', paddingHorizontal: 10 }}>
          {props?.title &&
            <Text style={CommonStyle.text16_inter_m} numberOfLines={1}>
              {props?.title}
            </Text>
          }
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end', paddingHorizontal: 0 }}>
          {props?.rightText &&
            <TouchableOpacity onPress={props?.onPressRight} style={styles.btnWrapper} disabled={!props?.isValid}>
              <Text style={[CommonStyle.text16_inter_m, { color: props?.isValid ? Theme.primary : '#D7D7D7' }]}
                numberOfLines={1}>
                {props?.rightText}
              </Text>
            </TouchableOpacity>
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
  },
});

export default AptoNavHeader;
