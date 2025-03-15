import { useCallback, useEffect, useState } from '@lynx-js/react';

import './App.css';
import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WorkoutsList, {
  VerticalScrollItem,
} from './components/WorkoutsList.jsx';
import ImageCard from './components/ImageCard.jsx';
import {
  furnituresPictures,
  type Picture,
} from './Pictures/furnitures/furnituresPictures.jsx';
import { calculateEstimatedSize } from './utils/utils.jsx';

export function App() {
  const pictureData = furnituresPictures;
  useEffect(() => {
    console.info('Hello, ReactLynx');
  }, []);

  const MyFirstPicture = furnituresPictures[0];
  return (
    <page>
      <view className="gallery-wrapper">
        <list
          className="list"
          list-type="waterfall"
          column-count={2}
          scroll-orientation="vertical"
          custom-list-name="list-container"
        >
          {pictureData.map((picture: Picture, index: number) => (
            <list-item
              estimated-main-axis-size-px={calculateEstimatedSize(
                picture.width,
                picture.height,
              )}
              item-key={'' + index}
              key={'' + index}
            >
              <ImageCard picture={picture} />
            </list-item>
          ))}
        </list>
      </view>
    </page>
  );
}
