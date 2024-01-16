/* eslint-disable react-native/no-inline-styles */
import {Pressable, Text} from 'react-native';
import IconRight from '../assets/icon_right.svg';
import {Fonts} from '../utils/fontStyle';
import React = require('react');
interface SeeMoreProps {
  link?: string;
}

function SeeMore({link}: SeeMoreProps) {
  return (
    <Pressable
      style={{flexDirection: 'row', alignItems: 'center', gap: 4.5}}
      onPress={() => {
        console.log(link);
      }}
    >
      <Text style={[Fonts.B2, {color: '#6F00F8'}]}>더보기</Text>
      <IconRight fill={'#6F00F8'} />
    </Pressable>
  );
}

export default SeeMore;
