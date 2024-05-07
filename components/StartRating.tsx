import React from 'react';
import {GestureResponderEvent, Pressable} from 'react-native';
import IconEmptyStar from '../assets/icon_emptystar.svg';
import IconFullStar from '../assets/icon_fullstar.svg';
import IconHalfStar from '../assets/icon_halfstar.svg';
import IconSlash from '../assets/icon_slash.svg';
import Group from './@base/Group';
import Typography from './@base/Typography';

interface StarProps {
  fill: boolean;
  half: boolean;
  onPress: (event: GestureResponderEvent) => void;
}
const Star = ({fill, half, onPress}: StarProps) => (
  <Pressable onPress={onPress}>
    {fill ? <IconFullStar /> : half ? <IconHalfStar /> : <IconEmptyStar />}
  </Pressable>
);

interface StarRatingProps {
  rating: number;
  setRating: (stars: number) => void;
}
const StarRating = ({rating, setRating}: StarRatingProps) => {
  const handlePress = (index: number) => (event: GestureResponderEvent) => {
    const {locationX} = event.nativeEvent;
    const halfPoint = index + 1 - 0.5;
    const fullPoint = index + 1;

    if (locationX < 16) {
      setRating(halfPoint);
    } else {
      setRating(fullPoint);
    }
  };

  return (
    <Group align="center" gap={13}>
      <Group gap={10}>
        {Array.from({length: 5}).map((_, index) => (
          <Star
            key={index}
            fill={rating >= index + 1}
            half={rating > index && rating - (index + 1) <= 0}
            onPress={handlePress(index)}
          />
        ))}
      </Group>
      {rating ? (
        <Group align="center">
          <Typography variant={'Title2'} color={'#6f00f8'}>
            {rating}
          </Typography>
          <IconSlash />
          <Typography variant={'Title2'} color={'#c8c8c8'}>
            5
          </Typography>
        </Group>
      ) : null}
    </Group>
  );
};

export default StarRating;
