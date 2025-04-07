import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import chevronLeft from '../assets/chevron-left.png';
import user from '../assets/user.png';
import { useGlobal } from '../store/global.js';
import { useSlideStore } from '../store/workout.js';
import Icon from './ui/Icon.jsx';
const locationMap = {
  '/': 'Home',
  '/wods': 'Wods',
  '/equipment': 'Equipment',
  '/movements': 'Movements',
  '/media': 'Media',
  '/home': 'App',
};

const Header = () => {
  const location = useLocation();
  console.log('🚀 ~ Header ~ location:', location);
  const nav = useNavigate();
  const state = useSlideStore((state) => state);
  const g = useGlobal((state) => state);
  const title = locationMap[location.pathname as keyof typeof locationMap];
  const handleBack = () => {
    g.setWorkoutIsStarted(false);
  };
  const handleHome = () => {
    nav('/');
  };
  const handleNav = () => {
    g.navigationFunction();
  };
  return (
    <>
      <view className={`header  ${location.pathname === '/' ? 'home' : ''}`}>
        {title !== 'Home' || g.workoutIsStarted ? (
          <Icon
            className="header-back"
            bindtap={handleBack}
            src={chevronLeft}
          />
        ) : (
          <view style={{ width: '24px' }} />
        )}
        <text bindtap={handleHome} className="header__title">
          {g.workoutIsStarted && 'Workout'}
          {title !== 'Home' && !g.workoutIsStarted ? title : ''}
        </text>
        {title !== 'Home' && !g.workoutIsStarted ? (
          <Icon className="header-user" src={user} />
        ) : (
          ''
        )}
      </view>
    </>
  );
};

export default Header;
