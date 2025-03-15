import React, { useEffect } from 'react';
import './style.css';
import { Swiper } from './Swiper.jsx';
import { useQuery } from '@tanstack/react-query';
const Wods = () => {
  const [wods, setWods] = React.useState<
    { thumbnail: string; workout: string }[]
  >([]);
  const query = useQuery({
    queryKey: ['wods'],
    queryFn: async (key) =>
      fetch(
        'https://fd4cxoelmw7qd2ujkx4cdoesvu.srv.us/api/admin/workouts?limit=12&page=1',
      ).then(async (res) => {
        const data = await res.json();
        setWods(data.wods);
        return data;
      }),
  });
  console.log('🚀 ~ Wods ~ query.data:', query.error);
  const data: { thumbnail: string; workout: string }[] =
    wods && (wods as { thumbnail: string; workout: string }[]);
  console.log('🚀 ~ Wods ~ data:', data);
  const easing = (x: number) => {
    'main thread';

    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };
  //   const getWods = async () => {
  //     const response = await fetch(
  //       'https://fd4cxoelmw7qd2ujkx4cdoesvu.srv.us/api/admin/workouts?limit=12&page=1',
  //     );
  //     const data = await response.json();
  //     console.log('🚀 ~ getWods ~ data:', data);
  //     return data;
  //   };
  //   useEffect(() => {
  //     getWods();
  //   }, []);

  return (
    <view className="page">
      <view className="wods">
        {wods && (
          <Swiper data={data} main-thread:easing={easing} duration={300} />
        )}
      </view>
    </view>
  );
};

export default Wods;
