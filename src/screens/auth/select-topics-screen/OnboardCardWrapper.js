import React, {PureComponent} from 'react';
import {
  View,
} from 'react-native';
import {PADDING_HOR, WINDOW_WIDTH} from '../../../styles/constant';
import ProductCard from '../../../components/product-card';

const CARD_WIDTH = (WINDOW_WIDTH - PADDING_HOR * 2 - 6) / 2;

class OnboardCardWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.item?.checked !== nextProps.item?.checked) {
      return true;
    }

    if (this.state.count !== nextState.count) {
      return true;
    }

    return true;
  }

  render() {

    return (
      <View style={{
        width: CARD_WIDTH,
        marginRight: this.props?.index % 2 === 0 ? 6 : 0,
        marginTop: 6,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <ProductCard item={this.props?.item} index={this.props?.type}
                     width={CARD_WIDTH}
                     height={CARD_WIDTH * 0.615}
                     onPressItem={this.props?.onPressItem}
        />
      </View>
    );
  }
}

export default OnboardCardWrapper;
