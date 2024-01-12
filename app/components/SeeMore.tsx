/* eslint-disable react-native/no-inline-styles */
import {css} from '@emotion/native';
import {Pressable, Text} from 'react-native';
import IconRight from '../assets/icon_right.svg';
import React = require('react');
interface SeeMoreProps {
  link: string;
  type: 'small' | 'big';
}

const styles = {
  small: css({
    fontSize: 12,
    fontFamily: 'SUIT-Regular',
    lineHeight: 17,
    color: '#6F00F8',
  }),
  big: css({
    fontSize: 17,
    color: '#6D6B6B',
  }),
};

function SeeMore({link, type}: SeeMoreProps) {
  return (
    <Pressable
      style={{flexDirection: 'row', alignItems: 'center', gap: 4.5}}
      onPress={() => {
        console.log(link);
      }}
    >
      <Text style={styles[type]}>더보기</Text>
      <IconRight fill={'#6F00F8'} />
    </Pressable>
  );
}

export default SeeMore;
