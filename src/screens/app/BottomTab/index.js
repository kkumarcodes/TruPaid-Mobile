import React, {Component} from 'react';
import {TabBar} from "./TabBar";
import {View} from "react-native";

// stack navigator
export const BottomTab = (props) => {
    return (
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <TabBar
                barColor={'#F9F9F9'}
            />
        </View>
    );
};
