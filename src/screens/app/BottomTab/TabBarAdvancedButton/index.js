import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {TabBg} from '../TabBg';
import {Theme} from '../../../../utils/theme';

export const TabBarAdvancedButton = ({bgColor, ...props}) => (
    <View
        style={styles.container}
        pointerEvents="box-none"
    >
        <TabBg
            color={bgColor}
            style={styles.background}
        />
        <TouchableOpacity
            style={styles.button}
            onPress={props.onPress}
        >
            <Image source={Theme.check} style={{width: 80, height: 80, resizeMode: 'contain', top: 9}}/>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 75,
        alignItems: 'center'
    },
    background: {
        position: 'absolute',
        top: 0,
    },
    button: {
        top: -22.5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 27,
        backgroundColor: Theme.primary,
    },
});
