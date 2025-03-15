import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import chevronLeft from '../assets/chevron-left.png';
import user from '../assets/user.png';
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
  const nav = useNavigate();
  const title = locationMap[location.pathname as keyof typeof locationMap];
  const handleBack = () => {
    nav(-1);
  };
  const handleHome = () => {
    nav('/');
  };
  return (
    <view className="header ">
      {title !== 'Home' ? (
        <Icon className="header-back" bindtap={handleBack} src={chevronLeft} />
      ) : (
        <view style={{ width: '24px' }} />
      )}
      <text bindtap={handleHome} className="header__title">
        {title}
      </text>
      <Icon className="header-user" src={user} />
    </view>
  );
};

export default Header;
