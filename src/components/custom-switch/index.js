import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Switch } from 'react-native-switch';
import { CommonStyle } from '../../styles';
import { Theme } from '../../styles/theme';

const CustomSwitch = (props) => {

  const onChangeSwitch = (val) => {
    props.onPressItem(props?.type, val);
  };

  return (
    <View>
      <View style={styles.listItem}>
        <View>
          <Text style={[CommonStyle.text14_inter_m]}>
            {props?.title}
          </Text>
        </View>

        <Switch
          value={props?.locked}
          onValueChange={(val) => onChangeSwitch(val)}
          circleSize={22}
          barHeight={26}
          circleBorderWidth={0}
          backgroundActive={Theme.primary}
          backgroundInactive={'#DBDBDB'}
          circleActiveColor={Theme.white}
          circleInActiveColor={Theme.white}
          renderActiveText={false}
          renderInActiveText={false}
          switchLeftPx={2}
          switchRightPx={2}
          switchWidthMultiplier={2.15}
          switchBorderRadius={22}
        />
      </View>

      <View style={styles.line} />

    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  line: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(196, 196, 196, 0.5)',
  },
});

export default CustomSwitch;
