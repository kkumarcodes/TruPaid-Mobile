import React, {PureComponent} from 'react';
import {
  View,
} from 'react-native';
import FeedCard from '../../../components/feed-card';

class FeedCardWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.item?.pendingDemand !== nextProps.item?.pendingDemand) {
      return true;
    }

    if (this.state.count !== nextState.count) {
      return true;
    }

    return false;
  }

  render() {
    if (this.props?.index >= this.props?.limit) {
      return null;
    }

    return (
      <View>
        <FeedCard
          item={this.props?.item}
          onPressItem={this.props?.onPressItem}
          onPressBuyingClub={this.props?.onPressBuyingClub}
        />
      </View>
    );
  }
}

export default FeedCardWrapper;
