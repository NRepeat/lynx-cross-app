import React from 'react';
import { useSlideStore } from '../../store/workout.js';
import { runOnBackground } from '@lynx-js/react';

const Filter = () => {
  const { filters, setFilters } = useSlideStore();

  return (
    <view className="filter">
      <view className="filter__options">
        <view
          bindtap={() => setFilters({ ...filters, gander: 'man' })}
          className={`button__options ${filters.gander === 'man' ? 'active' : ''}`}
        >
          <text>Man</text>
        </view>
        <view
          bindtap={() => setFilters({ ...filters, gander: 'women' })}
          className={` button__options ${filters.gander === 'women' ? 'active' : ''}`}
        >
          <text>Women</text>
        </view>
      </view>
      <view className="filter__options">
        <view
          bindtap={() => setFilters({ ...filters, difficulty: 'Rx' })}
          className={`button__options ${filters.difficulty === 'Rx' ? 'active' : ''}`}
        >
          <text>Rx'd</text>
        </view>
        <view
          bindtap={() => setFilters({ ...filters, difficulty: 'Scaled' })}
          className={`button__options ${filters.difficulty === 'Scaled' ? 'active' : ''}`}
        >
          <text>Scaled</text>
        </view>
      </view>
    </view>
  );
};

export default Filter;
