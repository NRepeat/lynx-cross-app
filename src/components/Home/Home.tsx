import React from 'react';
import ScrollView from './ScrollView.jsx';
import { homePageData } from '../../assets/index.js';
import { VerticalScrollItem } from './Item.jsx';

const Home = () => {
  const Items = () =>
    homePageData.map((item) => (
      <VerticalScrollItem key={item.link} title={item.title} link={item.link} />
    ));
  return (
    <view className="page">
      <ScrollView>
        <Items />
      </ScrollView>
    </view>
  );
};

export default Home;
