import ReactMarkdown from 'react-markdown';
function SwiperItem({
  pic,
  text,
  itemWidth,
}: {
  pic: string;
  itemWidth: number;
  text: string;
}) {
  return (
    <view style={{ width: `${itemWidth}px`, minHeight: `400px` }}>
      {/* <image
        mode="aspectFill"
        src={pic}
        style={{ width: '100%', minHeight: `200px` }}
      ></image> */}

      <text
        style={{
          fontSize: '20px',
          color: '#ffffff',
          padding: '10px',
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {text}
      </text>
    </view>
  );
}
export { SwiperItem };
