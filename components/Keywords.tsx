import {css} from '@emotion/native';
import React from 'react';
import {Pressable, Text} from 'react-native';
import {Fonts} from '../utils/fontStyle';
import {KeywordsProps} from '../utils/type';

import Group from './@base/Group';

const styles = {
  wrapper: css({
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#6f00f8',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }),
};
function Keywords({keywordItem, handleKeywordPress}: KeywordsProps) {
  const borderColor = keywordItem.selected ? '#6f00f8' : '#8c8c8c';
  return (
    <Pressable
      onPress={handleKeywordPress}
      style={[styles.wrapper, {borderColor: borderColor}]}
    >
      <Group>
        <Text style={[Fonts.Body2, {color: borderColor}]}>
          #{keywordItem.content}
        </Text>
      </Group>
    </Pressable>
  );
}

export default Keywords;
