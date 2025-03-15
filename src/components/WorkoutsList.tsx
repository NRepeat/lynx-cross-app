import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

const WorkoutsList = () => {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey: ['todos'],
    queryFn: (key) =>
      fetch('https://jsonplaceholder.typicode.com/albums/1/photos').then(
        (res) => res.json(),
      ),
  });
  return (
    <scroll-view
      // className="mt-10"
      scroll-orientation="vertical"
      style={{
        width: '100%',
        height: '100%',
        paddingLeft: '10px',
        marginLeft: '5px',
      }}
    >
      {query.data &&
        query.data
          ?.slice(0, 100)
          .map((item: any, index: number) => (
            <VerticalScrollItem
              index={index}
              text={item.title}
              image={item.url}
            />
          ))}
    </scroll-view>
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
