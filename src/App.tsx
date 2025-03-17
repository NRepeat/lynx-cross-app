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
  const items = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];
  const containerRef = useMainThreadRef<MainThread.Element>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [alterLogo, setAlterLogo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const animatingRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  console.log('🚀 ~ App ~ dragOffset:', dragOffset);
  const [dragging, setDragging] = useState(false);

  const handleTouchStart = (e: MainThread.TouchEvent) => {
    'main thread';
    touchStartX.current = e.touches[0].clientX;
    console.log('🚀 ~ App ~ touchStartX:', touchStartX.current);
  };

  const handleTouchMove = (e: MainThread.TouchEvent) => {
    'main thread';
    const touchMoveX = e.touches[0].clientX;
    const deltaX = touchMoveX - touchStartX.current;
    const xMulti = deltaX * 1.03;
    console.log('🚀 ~ handleTouchMove ~ xMulti:', xMulti);
    // Define the bounds to keep the card within the swiper container
    const itemWidth = SystemInfo.pixelWidth / SystemInfo.pixelRatio; // Adjust this to match the width of your items
    const lowerBound = 0;
    const upperBound = -(items.length - 1) * itemWidth;
    const realOffset = Math.min(lowerBound, Math.max(upperBound, xMulti));
    console.log('🚀 ~ handleTouchMove ~ realOffset:', realOffset);
    // Clamp the xMulti to stay within bounds

    e.currentTarget.setStyleProperties({
      transform: `translateX(${realOffset}px)`,
      animation: 'none', // Disable animations during the move
      transition: 'none', // Disable transition during the move
    });
  };

  const handleTouchEnd = (e: BaseTouchEvent<Target>) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchEndX.current - touchStartX.current;
    console.log('🚀 ~ handleTouchEnd ~ deltaX:', deltaX);

    // If swipe is significant, update the current index
    if (Math.abs(deltaX) > 50) {
      setCurrentIndex(
        (prevIndex) =>
          deltaX < 0
            ? (prevIndex + 1) % items.length // Swipe left to move to next card
            : (prevIndex - 1 + items.length) % items.length, // Swipe right to move to previous card
      );
    }

    // Reset the transform after the swipe
    setDragOffset(0);

    // Unlock animation after a delay
    setTimeout(() => (animatingRef.current = false), 600);
  };

  useEffect(() => {
    console.info('Hello, ReactLynx');
  }, []);

  return (
    <view className="page">
      <view className="swiper">
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <view
              key={index}
              style={{
                animation:
                  isActive && !isInitialLoad ? 'slideIn 0.6s forwards' : 'none', // Apply animation only after initial load
                transform: `translateX(${dragOffset}px)`, // Update the card's position based on the drag offset
              }}
              className={`swiper-item ${isActive ? 'active' : ''} ${isInitialLoad ? 'initial' : ''}`}
              main-thread:bindtouchstart={handleTouchStart}
              main-thread:ref={containerRef}
              main-thread:bindtouchmove={handleTouchMove}
              bindtouchend={handleTouchEnd}
            >
              <text style={{ color: 'black' }}> {item}</text>
            </view>
          );
        })}
      </view>
    </view>
  );
}
