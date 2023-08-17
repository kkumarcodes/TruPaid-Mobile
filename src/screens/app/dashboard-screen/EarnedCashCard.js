import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import CustomProgressBar from '../../../components/custom-progressbar';
import EarnedCashHeader from './EarnedCashHeader';

const earnedCashData = [
  {
    id: 1,
    name: "Kiehl's",
    value: 12,
  },
  {
    id: 2,
    name: 'Nike',
    value: 54,
  },
  {
    id: 3,
    name: 'Impossible Foundation',
    value: 8,
  },
  {
    id: 4,
    name: 'Adidas',
    value: 28,
  },
  {
    id: 5,
    name: 'Bershka',
    value: 20,
  },
  {
    id: 6,
    name: 'Other',
    value: 6,
  },
];

const EarnedCashCard = () => {
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

      <EarnedCashHeader/>

      <View style={styles.cardActivity}>
        {earnedCashData.map((item, key) => {
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

export default EarnedCashCard;
