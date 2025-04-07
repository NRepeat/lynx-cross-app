import {
  runOnBackground,
  useCallback,
  useEffect,
  useMainThreadRef,
  useRef,
  useState,
} from '@lynx-js/react';

import './App.css';
import type { BaseTouchEvent, MainThread, Target } from '@lynx-js/types';
import { useNavigate } from 'react-router';
import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';

export function App() {
  return <view className="page"></view>;
}
