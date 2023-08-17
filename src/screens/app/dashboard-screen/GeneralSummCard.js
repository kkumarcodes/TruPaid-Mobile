import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image, Text, ScrollView,
} from 'react-native';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

const menuList = [
  {value: '1', label: 'January'},
  {value: '2', label: 'February'},
  {value: '3', label: 'March'},
  {value: '4', label: 'April'},
  {value: '5', label: 'May'},
  {value: '6', label: 'June'},
  {value: '7', label: 'July'},
  {value: '8', label: 'August'},
  {value: '9', label: 'September'},
  {value: '10', label: 'October'},
  {value: '11', label: 'November'},
  {value: '12', label: 'December'},
];

const GeneralSummCard = () => {
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
    <View style={{paddingTop: 0}}>
      <View style={CommonStyle.row_bw}>
        <Text style={[CommonStyle.text14_inter_m, {color: Theme.black}]}>
          General Summ
        </Text>
      </View>

      <View style={styles.cardGeneralSumm}>
        <View>
          <View style={CommonStyle.row}>
            <Text style={[CommonStyle.text18_inter_r, {color: Theme.black}]}>
              $830.00
            </Text>
            <Text style={[CommonStyle.text10_inter_r, {color: '#63AC9F', paddingLeft: 5}]}>
              +32.50
            </Text>
          </View>

          <Text style={[CommonStyle.text12_inter_r, {color: Theme.greyDarkMedium}]}>
            Earned cash Reveel
          </Text>
        </View>

        <View style={{alignItems: 'flex-end'}}>
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
                      >{item.label}{' '}
                      </MenuItem>
                    </View>
                  );
                })}
              </ScrollView>
            </Menu>
          </TouchableOpacity>
          <View style={{height: 10}}/>
          <Image source={Theme.icon_linechart} style={styles.imgLineChart}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardGeneralSumm: {
    ...CommonStyle.row_bw,
    backgroundColor: Theme.white,
    borderRadius: 6,
    marginTop: 12,
    paddingHorizontal: PADDING_HOR,
    paddingVertical: 12,
  },
  imgLineChart: {
    width: 38,
    height: 24,
    resizeMode: 'contain',
  },
});

export default GeneralSummCard;
