import { useCallback, useEffect, useState } from '@lynx-js/react';

import './App.css';
import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';
import { useNavigate } from 'react-router';

export function App() {
  const [alterLogo, setAlterLogo] = useState(false);

  useEffect(() => {
    console.info('Hello, ReactLynx');
  }, []);

  const onTap = useCallback(() => {
    'background only';
    setAlterLogo(!alterLogo);
  }, [alterLogo]);

  const nav = useNavigate();
  const handleNavigate = useCallback(() => {
    nav('/home');
    console.info('Navigating to /home');
  }, [nav]);
  return (
    <view className="page">
      <text bindtap={() => handleNavigate()}>ReactLynx</text>
    </view>
  );
}
