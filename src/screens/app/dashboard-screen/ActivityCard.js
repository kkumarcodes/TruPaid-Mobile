import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import CustomProgressBar from '../../../components/custom-progressbar';

const ActivityData = [
  {
    id: 1,
    name: 'Jeans',
    value: 12,
  },
  {
    id: 2,
    name: 'Shoes',
    value: 54,
  },
  {
    id: 3,
    name: 'T-shirt',
    value: 8,
  },
  {
    id: 4,
    name: 'Other things',
    value: 30,
  },
];

const ActivityCard = () => {
  const dispatch = useDispatch();

  const renderActivityItem = (item) => {
    return (
      <View style={styles.cardActivityItem}>
        <View style={{width: 120, paddingRight: 10}}>
          <Text style={[CommonStyle.text12_inter_r, {color: Theme.greyDarkMedium}]} numberOfLines={1}>
            {item?.name}
          </Text>
        </View>

        <View
          style={{flex: 1}}>
          <CustomProgressBar
            value={item?.value ? item?.value : 0}
            color={'#B0B0CC'}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{paddingTop: 0, justifyContent: 'center'}}>

      <View style={CommonStyle.row_bw}>
        <View>
          <Text style={[CommonStyle.text14_inter_m, {color: Theme.black}]}>
            Activity by Category
          </Text>
        </View>

        <View style={CommonStyle.row}>
          <TouchableOpacity style={styles.btnPurchases}>
            <Text style={CommonStyle.text12_inter_r}>
              Purchases
            </Text>
          </TouchableOpacity>
          <View style={{width: 5}}/>
          <TouchableOpacity style={[styles.btnPurchases, {backgroundColor: 'transparent'}]}>
            <Text style={CommonStyle.text12_inter_r}>
              Views
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardActivity}>
        {ActivityData.map((item, key) => {
          return (
            <View key={key} style={CommonStyle.row}>
              {renderActivityItem(item)}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnPurchases: {
    backgroundColor: Theme.white,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  cardActivity: {
    backgroundColor: Theme.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginTop: 12,
    paddingHorizontal: PADDING_HOR,
    paddingVertical: 12,
  },
  cardActivityItem: {
    ...CommonStyle.row_bw,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
});

export default ActivityCard;
