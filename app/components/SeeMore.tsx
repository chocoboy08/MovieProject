import {css} from '@emotion/native';
import {Pressable, Text} from 'react-native';

interface SeeMoreProps {
  link: string;
  type: 'small' | 'big';
}

const styles = {
  small: css({
    fontSize: 12,
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
      onPress={() => {
        console.log(link);
      }}
    >
      <Text style={styles[type]}>더보기</Text>
    </Pressable>
  );
}

export default SeeMore;
