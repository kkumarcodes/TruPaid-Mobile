import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { CommonStyle } from '../../styles';

// https://www.educba.com/react-native-progress-bar/
const CustomProgressBar = (props) => {
  const [progressStatusValue, setProgress] = useState(0);

  const animation = new Animated.Value(0);  //initialisation of Animated component to with initial value as the zero for start of the progress bar.

  useEffect(() => {
    onAnimation();
  }, [props.value]);

  const onAnimation = () => {
    animation.addListener(({ value }) => {
      setProgress(parseInt(value, 10));
    });

    Animated.timing(animation, {
      toValue: props.value ? props.value : 0,  //value at which it need to reach for end of the progress bar
      duration: 800,  //duration till the progress bar will continue
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={progressStyles.containerStyle}>
      <View style={progressStyles.containerStyle2}>
        <Animated.View
          style={[
            progressStyles.innerStyle, { width: progressStatusValue + '%' }, { backgroundColor: props.color },
          ]}
        />
      </View>

      <Animated.Text style={[CommonStyle.text12_inter_r, { width: 40, textAlign: 'right' }]}>
        {progressStatusValue}%
      </Animated.Text>
    </View>
  );
};

//basic styles for creation of progress bar
const progressStyles = StyleSheet.create({
  containerStyle: {
    width: "100%",
    ...CommonStyle.row
  },
  containerStyle2: {
    flex: 1,
    height: 9,
    borderRadius: 30,
    backgroundColor: '#EFEFFA',
  },
  innerStyle: {
    width: "100%",
    height: 9,
    borderRadius: 16,
  },
});


export default CustomProgressBar;
