import {
  runOnBackground,
  useCallback,
  useEffect,
  useMainThreadRef,
  useRef,
  useState,
} from '@lynx-js/react';

import './App.css';
import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';
import { useNavigate } from 'react-router';
import type { BaseTouchEvent, MainThread, Target } from '@lynx-js/types';

export function App() {
  return <view className="page"></view>;
}
