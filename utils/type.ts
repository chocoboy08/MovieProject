import {ReactNode} from 'react';
import {GestureResponderEvent, ImageSourcePropType} from 'react-native';
export interface Movie {
  title: string;
  poster: string;
  tmdbId?: number;
  director?: string;
  genre?: string;
  year?: string;
  plot?: string;
  nation?: string;
  rating?: string;
  review?: string;
  tagline?: string;
}
export interface ReviewData {
  rating: string | null;
  date: string | null;
  keywords: string[];
  review: string | null;
}
export interface PlayList {
  name: string;
  poster: string;
  playlistId?: number;
  title?: string;
  total?: number;
}
export interface CalendarMovie {
  [date: string]: Movie[] | undefined;
}
export interface Keyword {
  selected: boolean;
  content: string;
}
export interface KeywordsProps {
  keywordItem: Keyword;
  handleKeywordPress?: (event: GestureResponderEvent) => void;
}

export interface SearchItem {
  title: string;
}

export interface SearchMovie extends Movie {
  tmdbId: number;
}

export interface Heart {
  heart: boolean;
}

export interface Watched {
  watched: boolean;
}

export interface GenreStorage {
  poster: string;
  genre: string;
}

export interface StorageBoxProps {
  width: number;
  height: number;
  isEmpty?: boolean;
  img?: ImageSourcePropType;
  children: ReactNode;
  onPress: () => void;
}
