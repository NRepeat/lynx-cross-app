import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import chevronLeft from '../assets/chevron-left.png';
import user from '../assets/user.png';
import Icon from './ui/Icon.jsx';
import { useSlideStore } from '../store/workout.js';
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
  const title = locationMap[location.pathname as keyof typeof locationMap];
  const handleBack = () => {
    nav(-1);
  };
  const handleHome = () => {
    nav('/');
  };
  return (
    <>
      {title === 'Wods' ? (
        <></>
      ) : (
        <view className="header ">
          {title !== 'Home' ? (
            <Icon
              className="header-back"
              bindtap={handleBack}
              src={chevronLeft}
            />
          ) : (
            <view style={{ width: '24px' }} />
          )}
          <text bindtap={handleHome} className="header__title">
            {title}
          </text>
          <Icon className="header-user" src={user} />
        </view>
      )}
    </>
  );
};

export default Header;
