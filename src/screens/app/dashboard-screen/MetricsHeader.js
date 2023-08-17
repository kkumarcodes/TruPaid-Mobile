import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image, Text, ScrollView,
} from 'react-native';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

const menuList = [
  {value: '1', label: 'Last 7 days'},
  {value: '2', label: 'Last 1 month'},
  {value: '3', label: 'Last 1 year'},
];

const MetricsHeader = () => {
  const dispatch = useDispatch();
  const [selectFilter, setSelectFilter] = useState(null);
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  useEffect(() => {
    setSelectFilter(menuList[0]);
  }, []);

  const onPressMenuItem = async (item) => {
    setSelectFilter(item);
    hideMenu();
  };

  const onPressMenuOpen = () => {
    showMenu();
  };

  return (
    <View style={CommonStyle.row_bw}>
      <View style={CommonStyle.row}>
        <Text style={[CommonStyle.text14_inter_m, {color: Theme.black, paddingLeft: 5}]}>
          Metrics
        </Text>
      </View>

      <TouchableOpacity style={CommonStyle.row} onPress={() => onPressMenuOpen()}>
        <Text style={[CommonStyle.text12_inter_r, {color: Theme.black}]}>
          {selectFilter?.label}
        </Text>
        <View style={{paddingLeft: 8}}>
          <Image source={Theme.icon_arrow_down} style={{width: 8, height: 8, resizeMode: 'contain'}}/>
        </View>

        <Menu
          visible={visible}
          // anchor={<Text onPress={showMenu}>{selectFilter?.label}</Text>}
          onRequestClose={hideMenu}
        >
          <ScrollView style={{maxHeight: 300}} showsVerticalScrollIndicator={false}>
            {menuList.map((item, key) => {
              return (
                <View key={key}>
                  <MenuItem onPress={() => onPressMenuItem(item)}
                            style={[CommonStyle.row, {
                              paddingHorizontal: 15,
                            }]}
                            textStyle={[CommonStyle.text10_inter_r, {color: Theme.black, paddingLeft: 6}]}
                  >{item.label}{' '}</MenuItem>
                </View>
              );
            })}
          </ScrollView>
        </Menu>
      </TouchableOpacity>
    </View>
  );
};

export default MetricsHeader;
