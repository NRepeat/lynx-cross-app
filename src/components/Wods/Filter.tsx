import React from 'react';
import { useSlideStore } from '../../store/workout.js';
import { runOnBackground } from '@lynx-js/react';

const Filter = () => {
  const { availableFilters, filters, setFilters } = useSlideStore();

  // Helper function to convert the Map entries to an object for easier use
  const getFilterOptions = () => {
    const options = {};

    // Convert Map to regular object with arrays
    availableFilters.forEach((valueSet, key) => {
      options[key] = Array.from(valueSet);
    });

    return options;
  };

  const filterOptions = getFilterOptions();

  const isActive = (filterType, value) => {
    if (!filters[filterType]) return false;

    if (Array.isArray(filters[filterType])) {
      return filters[filterType].includes(value);
    }

    return filters[filterType] === value;
  };

  const handleFilterSelect = (filterType, value) => {
    if (
      ['gender', 'difficulty', 'wodType', 'equipment', 'exercise'].includes(
        filterType,
      )
    ) {
      if (
        Array.isArray(filters[filterType]) &&
        filters[filterType].includes(value)
      ) {
        const newValues = filters[filterType].filter((v) => v !== value);
        setFilters({
          ...filters,
          [filterType]: newValues.length > 0 ? newValues : undefined,
        });
      } else {
        const currentValues = Array.isArray(filters[filterType])
          ? filters[filterType]
          : [];
        setFilters({
          ...filters,
          [filterType]: [...currentValues, value],
        });
      }
    } else {
      setFilters({ ...filters, [filterType]: value });
    }
  };

  const renderFilterCategory = (categoryName, filterType) => {
    if (!filterOptions[filterType] || filterOptions[filterType].length === 0) {
      return null;
    }

    return (
      <view key={filterType} className="filter__category">
        <text className="filter__category-title">{categoryName}</text>
        <view className="filter__options">
          {filterOptions[filterType].map((value) => (
            <view
              key={`${filterType}-${value}`}
              bindtap={() => handleFilterSelect(filterType, value)}
              className={`button__options ${isActive(filterType, value) ? 'active' : ''}`}
            >
              <text>{value.toUpperCase() as string}</text>
            </view>
          ))}
        </view>
      </view>
    );
  };

  // Time filter with predefined options (in minutes)
  const timeOptions = [10, 20, 30, 45, 60];

  return (
    <>
      <scroll-view
        className="filter"
        scroll-orientation="vertical"
        style={{
          width: '100%',
          height: '75vh',
        }}
      >
        {/* Gender filter */}
        {renderFilterCategory('Gender', 'gender')}

        {/* Difficulty filter */}
        {renderFilterCategory('Difficulty', 'difficulty')}

        {/* Workout Type filter */}
        {renderFilterCategory('Workout Type', 'wodType')}

        {/* Equipment filter */}
        {renderFilterCategory('Equipment', 'equipment')}

        {/* Exercise filter */}
        {renderFilterCategory('Exercise', 'exercise')}

        {/* Time filter */}
        {/* <view className="filter__category">
        <text className="filter__category-title">Max Time (minutes)</text>
        <view className="filter__options">
          {timeOptions.map((time) => (
            <view
              key={`time-${time}`}
              bindtap={() => handleFilterSelect('time', time)}
              className={`button__options ${filters.time === time ? 'active' : ''}`}
            >
              <text>{time}</text>
            </view>
          ))}
        </view>
      </view> */}

        {/* Reset filters button */}
      </scroll-view>
      <view className="filter__reset">
        <view bindtap={() => setFilters({})} className="button__reset">
          <text>Reset Filters</text>
        </view>
      </view>
    </>
  );
};

export default Filter;
