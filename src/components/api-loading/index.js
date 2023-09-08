import React, { } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Theme } from '../../styles/theme';
import { WINDOW_HEIGHT } from '../../styles/constant';

const ApiLoading = (props) => {
  const {
    apiLoading,
  } = props;

  if (apiLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.white} />
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000044',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  body_container: {
    flex: 1,
    width: '1%',
    height: '1%',
    position: 'absolute',
    top: WINDOW_HEIGHT / 2,
    zIndex: 100000,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    apiLoading: state.config.apiLoading,
    config: state.config,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApiLoading);
