import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {LineChart} from 'react-native-chart-kit';

const chartConfigs = [
  {
    backgroundColor: '#000000',
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: '#022173',
    backgroundGradientFrom: '#022173',
    backgroundGradientTo: '#1b3fa0',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(67, 69, 143, ${opacity})`,
    strokeWidth: 1, // optional, default 3
    // barPercentage: 1, // 0-1
    // useShadowColorFromDataset: false, // optional,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#fff',
    },
    propsForHorizontalLabels: {
      marginVertical: 8,
      borderRadius: 16,
      color: 'red',
      paddingVertical: 20,
    },
    propsForVerticalLabels: {
      marginVertical: 8,
      borderRadius: 16,
      color: 'red',
      paddingVertical: 20,
    },
    propsForLabels: {
      marginVertical: 8,
      borderRadius: 16,
      color: 'red',
      paddingVertical: 20,
    },
    propsForBackgroundLines: {
      color: 'red',
      paddingVertical: 20,
    },
  },
  {
    backgroundColor: '#26872a',
    backgroundGradientFrom: '#43a047',
    backgroundGradientTo: '#66bb6a',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: '#000000',
    backgroundGradientFrom: '#000000',
    backgroundGradientTo: '#000000',
    color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`,
  }, {
    backgroundColor: '#0091EA',
    backgroundGradientFrom: '#0091EA',
    backgroundGradientTo: '#0091EA',
    color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`,
  },
  {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: '#b90602',
    backgroundGradientFrom: '#e53935',
    backgroundGradientTo: '#ef5350',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: '#ff3e03',
    backgroundGradientFrom: '#ff3e03',
    backgroundGradientTo: '#ff3e03',
    color: (opacity = 1) => `rgba(${0}, ${0}, ${0}, ${opacity})`,
  },
];

const ChartCard = () => {
  const dispatch = useDispatch();
  const [chartValue, setChartValue] = useState(0);
  const minValue = 0;

  function* yLabel() {
    yield* [minValue, 100, 200, 300, 400, 500];
  }

  function* xLabel() {
    yield* ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  }

  const yLabelIterator = yLabel();
  const xLabelIterator = xLabel();


  const onDataPointClick = (data) => {
    console.log(data);
    setChartValue(data?.value);
  };

  return (
    <View style={{flex: 1, marginTop: 10, backgroundColor: Theme.white, borderRadius: 6, overflow: 'hidden'}}>
      {chartValue !== 0 ?
        <View style={[styles.textChartWrapper]}>
          <Text style={CommonStyle.text12_inter_r}>
            + ${chartValue}
          </Text>
        </View>
        :  <View style={[styles.textChartWrapper, {borderColor: Theme.white}]}>
          <Text style={CommonStyle.text12_inter_r}/>
        </View>
      }
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          datasets: [
            {
              data: [280, 260, 330, 220, 278, 250, 300, 245],
              color: (opacity = 1) => `rgba(67, 69, 143, ${opacity})`, // optional
              strokeWidth: 2, // optional
            },
          ],
          // legend: ['Earning'], // optional
        }}
        width={WINDOW_WIDTH - PADDING_HOR * 2} // from react-native
        height={150}
        yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        withDots={true}
        chartConfig={{
          ...chartConfigs[2],
          style: {
            paddingBottom: 20,
          },
        }}
        verticalLabelRotation={0}
        yLabelsOffset={10}
        xLabelsOffset={-5}
        // hidePointsAtIndex={[0,1, 3, 4, 5, 6, 7]}
        onDataPointClick={onDataPointClick}
        formatYLabel={() => yLabelIterator.next().value}
        // formatXLabel={() => xLabelIterator.next().value}
        fromZero={true}
        withHorizontalLines={true}
        withVerticalLines={true}
        withOuterLines={true}
        withInnerLines={false}
        bezier
        style={{
          borderBottomRightRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      />

      <View style={{height: 15}}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textChartWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Theme.white,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.background,
    paddingHorizontal: 10,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // marginHorizontal: 1,
    marginTop: 10,
  },
});

export default ChartCard;
