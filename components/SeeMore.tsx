/* eslint-disable react-native/no-inline-styles */
import {Pressable} from 'react-native';
import IconRight from '../assets/icon_right.svg';
import Typography from './@base/Typography';
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
      <Typography variant="Info" color="#6f00f8">
        더보기
      </Typography>
      <IconRight fill={'#6F00F8'} />
    </Pressable>
  );
}

export default SeeMore;
