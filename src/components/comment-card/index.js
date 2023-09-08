import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PADDING_HOR } from '../../styles/constant';
import { CommonStyle } from '../../styles';
import TimeAgo from '@andordavoti/react-native-timeago';
import { Theme } from '../../styles/theme';
import React from 'react';
import moment from 'moment';

const CommentCard = (props) => {
  const comment = props?.item;
  return (
    <View style={{ flexDirection: 'row', paddingTop: PADDING_HOR }}>
      <View style={[styles.profileWrapper, { borderRadius: 38 }]}>
        <Image source={{ uri: comment?.profile ? comment?.profile : 'http' }} style={styles.profile} />
      </View>

      <View style={[CommonStyle.row_bw, { flex: 1, paddingLeft: 10 }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={[CommonStyle.text12_inter_m, { lineHeight: 18 }]}>
            {comment?.fname} {comment?.lname}
          </Text>
          <Text style={[CommonStyle.text12_inter_r, { lineHeight: 18, paddingTop: 5 }]}>
            {comment?.content}
          </Text>
          <View style={[CommonStyle.row, { paddingTop: 6 }]}>
            <TimeAgo dateTo={moment(comment?.createdAt).toDate()} updateInterval={10000}
              style={[CommonStyle.text10_inter_r, { color: Theme.grey, lineHeight: 18 }]} />

            <TouchableOpacity style={{ marginLeft: 20, padding: 10, margin: -10 }}>
              <Text style={[CommonStyle.text10_inter_r, { color: Theme.grey, lineHeight: 18 }]}>
                Reply
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[CommonStyle.row, { marginTop: -25 }]}>
          <TouchableOpacity>
            <Image source={Theme.icon_heart} style={{
              width: 15,
              height: 15,
              resizeMode: 'contain',
              tintColor: comment?.favorite ? '#FF5C00' : '#ccc',
            }} />
          </TouchableOpacity>
          <Text style={[CommonStyle.text12_inter_r, { paddingLeft: 4, color: comment.favorite_count === 0 ? '#fff' : comment?.favorite ? '#FF5C00' : '#ccc' }]}>
            {comment.favorite_count}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  profileWrapper: {
    width: 38,
    height: 38,
    backgroundColor: Theme.white,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(196, 196, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profile: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  cardWrapper: {
    width: 34,
    height: 34,
    backgroundColor: '#FCF9F3',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  card: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  shopLogoWrapper: {
    width: 34,
    height: 34,
    borderRadius: 3,
    borderColor: Theme.lightGrey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 34,
    height: 34,
    resizeMode: 'cover',
  },
  myCommentWrapper: {
    padding: PADDING_HOR,
  },
  line: {
    height: 0.5,
    backgroundColor: Theme.grey,
  },

});
