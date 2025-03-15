import React, { type FC } from 'react';

interface IconProps {
  src: string;
  bindtap?: () => void;
  className?: string;
}

const Icon: FC<IconProps> = ({ className = '', src, bindtap }) => {
  return (
    <view className={'icon' + ' ' + className} bindtap={bindtap}>
      <image src={src} />
    </view>
  );
};

export default Icon;
