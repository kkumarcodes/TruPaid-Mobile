import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import {CommonStyle} from '../../styles';

export default () => (
  <View style={[CommonStyle.center, {flex: 1}]}>
    <ActivityIndicator size="large" color={'#ff5dc8'} />
  </View>
)
