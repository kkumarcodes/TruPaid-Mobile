import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Platform, Image} from 'react-native';
import {BottomTabBar, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IS_IPHONE_X} from '../../../../styles/global';
import {Theme} from '../../../../styles/theme';
import FeedScreen from '../../feed-screen';
import DealFeedScreen from '../../deal-feed-screen';
import ProfileScreen from '../../profile-screen';
import ReveelCardScreen from '../../../trupaid-card';

const BottomBar = createBottomTabNavigator();

export const TabBar = ({barColor}) => (
  <BottomBar.Navigator
    tabBar={(props) => (
      <View style={styles.navigatorContainer}>
        <BottomTabBar
          {...props}
        />
        {IS_IPHONE_X && (
          <View style={[styles.xFillLine, {
            backgroundColor: barColor,
          }]}/>
        )}
      </View>
    )}
    screenOptions={{
      headerShown: null,
      tabBarStyle: [styles.navigator, {backgroundColor: barColor}],
      tabBarActiveTintColor: barColor,
      tabBarInactiveBackgroundColor: barColor,
      tabBarLabelStyle: {
        top: -8,
        fontSize: 12,
        fontFamily: 'Inter-Regular',
      },
    }}
  >
    <BottomBar.Screen
      name="Feed"
      component={FeedScreen}
      options={{
        tabBarIcon: ({focused, color}) => (
          focused ?
            <View>
              <View style={styles.circle}/>
              <Image source={Theme.icon_feed_nor} style={styles.icon}/>
            </View>
            :
            <Image source={Theme.icon_feed_dis} style={styles.icon}/>
        ),
        tabBarLabel: '',
      }}
    />
    <BottomBar.Screen
      name="DealFeed"
      component={DealFeedScreen}
      options={{
        tabBarIcon: ({focused, color}) => (
          focused ?
            <View>
              <View style={styles.circle}/>
              <Image source={Theme.icon_dealfeed_nor} style={styles.icon}/>
            </View>
            :
            <Image source={Theme.icon_dealfeed_dis} style={styles.icon}/>
        ),
        tabBarLabel: '',
      }}
    />
    <BottomBar.Screen
      name="ReveelCard"
      component={ReveelCardScreen}
      options={{
        tabBarIcon: ({focused, color}) => (
          focused ?
            <View>
              <View style={styles.circle}/>
              <Image source={Theme.icon_trupaid_card_nor} style={styles.icon}/>
            </View>
            :
            <Image source={Theme.icon_trupaid_card_dis} style={styles.icon}/>
        ),
        tabBarLabel: '',
      }}
    />
    <BottomBar.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({focused, color}) => (
          focused ?
            <View>
              <View style={styles.circle}/>
              <Image source={Theme.icon_profile_nor} style={styles.icon}/>
            </View>
            :
            <Image source={Theme.icon_profile_dis} style={styles.icon}/>
        ),
        tabBarLabel: '',
      }}
    />
  </BottomBar.Navigator>
);

const styles = StyleSheet.create({
  navigatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderTopWidth: 1,
    borderTopColor: Theme.background
  },
  navigator: {
    position: 'absolute',
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 10,
    height: IS_IPHONE_X ? 80 : 60,
  },
  xFillLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
  },
  circle: {
    position: 'absolute',
    top: -15,
    // width: 12,
    width: 0,
    height: 7,
    backgroundColor: Theme.primary,
    alignSelf: 'center',
    borderBottomColor: 'red',
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain'
  }
});
