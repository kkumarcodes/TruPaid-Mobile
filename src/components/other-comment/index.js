import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {PADDING_HOR} from '../../styles/constant';
import {CommonStyle} from '../../styles';
import {Theme} from '../../styles/theme';
import React, {useEffect, useRef, useState} from 'react';
import CommentCard from '../comment-card';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {commentsList} from '../../assets/template/template';

const menuList = [
  {value: '1', label: 'Recent'},
  {value: '2', label: 'Favorite'},
];

const OtherComments = (props) => {
  const transactionInfo = props?.item;
  const [selectFilter, setSelectFilter] = useState(null);
  const [comments, setComments] = useState(commentsList);
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
    <View style={{flex: 1, paddingHorizontal: PADDING_HOR}}>
      <View style={CommonStyle.row_bw}>
        <View>
          <Text style={[CommonStyle.text12_inter_sb, {color: Theme.black}]}>
            {comments?.length} Comments
          </Text>

        </View>

        <TouchableOpacity style={CommonStyle.row} onPress={() => onPressMenuOpen()}>
          <Text style={[CommonStyle.text12_inter_r, {color: Theme.grey}]}>
            Sort by: {''}
            <Text style={[CommonStyle.text12_inter_sb, {color: Theme.black}]}>
              {selectFilter?.label}
            </Text>
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


      {Array.isArray(comments) && comments?.map((item, key) => {
        return (
          <View key={key}>
            <CommentCard item={item}/>
          </View>
        );
      })}

      <View style={{height: 80}}/>
    </View>
  );
};

export default OtherComments;
