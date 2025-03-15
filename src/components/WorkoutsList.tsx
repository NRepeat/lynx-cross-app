// import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from '@lynx-js/react/legacy-react-runtime';
import { calculateEstimatedSize } from '../utils/utils.jsx';
import ImageCard from './ImageCard.jsx';
import { useQuery } from '@tanstack/react-query';
const WorkoutsList = () => {
  // const query = useQuery({
  //   queryKey: ['wods'],
  //   queryFn: (key) =>
  //     fetch(
  //       'https://fd4cxoelmw7qd2ujkx4cdoesvu.srv.us/api/admin/workouts?limit=125&page=1',
  //     ).then((res) => res.json()),
  // });

  return (
    <view className="gallery-wrapper">
      <list
        className="list"
        list-type="waterfall"
        column-count={2}
        scroll-orientation="vertical"
        custom-list-name="list-container"
      >
        {query.data &&
          query.data.wods &&
          query.data.wods.map((item: any, index: number) => (
            <list-item
              // estimated-main-axis-size-px={calculateEstimatedSize(150, 150)}
              item-key={'' + index}
              key={'' + index}
            >
              <ImageCard
                picture={item.thumbnail && item.thumbnail}
                text={item.workout}
              />
            </list-item>
          ))}
      </list>
    </view>
  );
};

export default WorkoutsList;

export const VerticalScrollItem = (props: {
  index: number;
  text: string;
  image: string;
}) => {
  return (
    <view style={{ width: 'calc(100% - 10px)', height: '160px,' }}>
      <text style={{ fontSize: '16px', paddingLeft: '6px', paddingTop: '6px' }}>
        {`item-${props.text}`}
      </text>
      <image
        src={props.image}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '10px',
        }}
      />
    </view>
  );
};
