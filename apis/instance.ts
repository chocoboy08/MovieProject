import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://13.124.184.115',
  headers: {
    'Content-Type': 'application/json',
  },
});
