import React from 'react';
import { useSlideStore } from '../../store/workout.js';

const Filter = () => {
  const { filters, toggleDifficultyFilters, toggleGenderFilters } =
    useSlideStore((state) => state);
  const handleTogleGenderFilters = (filter: 'man' | 'women') => {
    toggleGenderFilters(filter);
  };
  const handleTogleDificultyFilters = (
    difficulty: 'Rx' | 'Scaled' | 'Foundations' | undefined,
  ) => {
    toggleDifficultyFilters(difficulty);
  };
  return (
    <view className="filter">
      <view className="filter__options">
        <view
          bindtap={() => handleTogleGenderFilters('man')}
          className={`button__options ${filters.gander === 'man' ? 'active' : ''}`}
        >
          <text>Man</text>
        </view>
        <view
          bindtap={() => handleTogleGenderFilters('women')}
          className={` button__options ${filters.gander === 'women' ? 'active' : ''}`}
        >
          <text>Women</text>
        </view>
      </view>
      <view className="filter__options">
        <view
          bindtap={() => handleTogleDificultyFilters('Rx')}
          className={`button__options ${filters.difficulty === 'Rx' ? 'active' : ''}`}
        >
          <text>Rx'd</text>
        </view>
        <view
          bindtap={() => handleTogleDificultyFilters('Scaled')}
          className={`button__options ${filters.difficulty === 'Scaled' ? 'active' : ''}`}
        >
          <text>Scaled</text>
        </view>
      </view>
    </view>
  );
};

export default Filter;
