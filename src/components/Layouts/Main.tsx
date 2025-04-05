import React, { type FC } from 'react';
import Footer from '../Footer.jsx';
import Header from '../Header.jsx';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <view className="main-layout">
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </view>
  );
};

export default MainLayout;
