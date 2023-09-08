import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Theme } from '../../styles/theme';
import { CommonStyle } from '../../styles';
import { PADDING_HOR, WINDOW_WIDTH } from '../../styles/constant';

const CategoriesView = (props) => {
  const [categories, setCategories] = useState(props?.data);

  useEffect(() => {

  }, []);

  const onPressCategoryItem = (selItem) => {
    let newCategories = [];
    categories?.map((item, key) => {
      if (item?.id !== selItem?.id) {
        newCategories.push({
          ...item,
          checked: false,
        });
      } else {
        newCategories.push({
          ...item,
          checked: true,
        });
      }
    });
    setCategories(newCategories);

    props?.setSelectCategory(selItem);
  };

  const CategoryButton = (item) => {
    return (
      <TouchableOpacity style={[styles.btnCategory, {
        backgroundColor: item?.checked ? Theme.primary : 'transparent',
        borderColor: 'rgba(196, 196, 196, 0.18)',
        borderWidth: item?.checked ? 1 : 1,
      }]}
        onPress={() => onPressCategoryItem(item)}
      >
        <Text style={[CommonStyle.text12_inter_m, {
          color: item?.checked ? Theme.white : Theme.black,
        }]}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingVertical: 20, backgroundColor: 'transparent' }}>
      <View style={{ paddingHorizontal: PADDING_HOR }}>
        <Text style={CommonStyle.text16_inter_m}>
          Categories
        </Text>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {categories.map((item, key) => {
          return (
            <View key={key}
              style={{
                paddingTop: 20,
                paddingBottom: 10,
                paddingLeft: key === 0 ? PADDING_HOR : 10,
                paddingRight: key === categories.length - 1 ? PADDING_HOR : 0,
              }}>
              {CategoryButton(item)}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  btnCategory: {
    ...CommonStyle.center,
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 20,
    minWidth: WINDOW_WIDTH * 0.25,
  },
});

export default CategoriesView;
