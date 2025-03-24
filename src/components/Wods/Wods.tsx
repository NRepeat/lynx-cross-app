import React from 'react';
import './style.css';
import { Swiper } from './Swiper.jsx';
import Filter from './Filter.jsx';

const Wods = () => {
  return (
    <view className="page">
      <view className="wods">
        <Swiper duration={300} />
      </view>
      <Filter />
    </view>
  );
};

export default Wods;
