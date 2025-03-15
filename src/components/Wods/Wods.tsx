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
      <view className="wods">{wods && <Swiper data={data} />}</view>
    </view>
  );
};

export default Wods;
