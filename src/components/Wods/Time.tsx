import React, { useEffect, useState } from 'react';
import './timer.css';

const Time = ({ time }: { time: number }) => {
  const [progress, setProgress] = useState(0);
  const maxTime = 60; // Полное время (60 мин)

  useEffect(() => {
    setProgress((time / maxTime) * 100); // Преобразуем в процентное значение
  }, [time]);

  return (
    <view className="time__container">
      {/* <view className="time__progress" /> */}

      {/* <view className="time__progress__after" /> */}

      <text className="time__text">{time} min</text>
    </view>
  );
};

export default Time;
