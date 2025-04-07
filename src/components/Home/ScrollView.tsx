import type React from 'react';
import type { FC } from 'react';
import { VerticalScrollItem } from './Item.jsx';
interface ScrollViewProps {
  // data: { title: string; link: string }[];
  children: React.ReactNode;
}

const ScrollView: FC<ScrollViewProps> = ({ children }) => {
  return (
    <list
      className="list"
      list-type="single"
      column-count={1}
      scroll-orientation="vertical"
      custom-list-name="list-container"
    >
      {children}
    </list>
  );
};

export default ScrollView;
