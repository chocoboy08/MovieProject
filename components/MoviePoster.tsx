import React from 'react';
import {DimensionValue, Image, ImageSourcePropType} from 'react-native';

interface MoviePosterProps {
  width: DimensionValue;
  height: DimensionValue;
  radius: number;
  img: ImageSourcePropType;
}

function MoviePoster({width, height, radius, img}: MoviePosterProps) {
  return (
    <Image
      source={img}
      style={{width: width, height: height, borderRadius: radius}}
    />
  );
}

export default MoviePoster;
