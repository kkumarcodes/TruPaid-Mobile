import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Theme } from '../../styles/theme';
import { CommonStyle } from '../../styles';
import FastImage from 'react-native-fast-image';

const ProductCard = (props) => {

  const onPressItem = (item) => {
    props?.onPressItem(item, props?.index);
  };

  return (
    <View style={[styles.container, {
      borderColor: props?.item?.checked ? Theme.primary : Theme.white, backgroundColor: 'rgba(0,0,0,1)',
    }]}>
      <TouchableOpacity onPress={() => onPressItem(props?.item)}
        activeOpacity={0.8}
      >
        {props?.item?.src ?
          <FastImage
            source={{ uri: props?.item?.src ? props?.item?.src + '' : 'http' }}
            style={{ width: props?.width, height: props?.height, resizeMode: 'stretch', opacity: 0.7 }}
          />
          : <View style={{ width: props?.width, height: props?.height, backgroundColor: Theme.grey }} />
        }
        {props?.item?.checked &&
          <View style={styles.favoriteWrapper}>
            <Image
              source={Theme.icon_check_w}
              style={[styles.check]}
            />
          </View>
        }

        <View style={styles.title}>
          <Text style={styles.textTitle}>
            {props?.item?.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.greyIcon,
    borderRadius: 8,
    borderColor: Theme.primary,
    borderWidth: 3,
    overflow: 'hidden',
  },
  btnPlus: {
    position: 'absolute',
    width: 38,
    height: 40,
    bottom: 8,
    right: 8,
    backgroundColor: Theme.primary,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteWrapper: {
    position: 'absolute',
    top: 15,
    right: 15,
    borderRadius: 8,
    width: 26,
    height: 26,
    backgroundColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: {
    width: 14,
    height: 11,
    resizeMode: 'contain',
  },
  title: {
    position: 'absolute',
    bottom: 15,
    paddingHorizontal: 15,
  },
  textTitle: {
    ...CommonStyle.text14_inter_m,
    color: Theme.white,
  },
});

export default ProductCard;
