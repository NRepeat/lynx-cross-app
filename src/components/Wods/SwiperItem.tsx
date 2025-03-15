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
  function removeAsterisks(text: string): string {
    return text.replace(/\*/g, '');
  }
  return (
    <view style={{ width: `${itemWidth}px`, minHeight: `100%` }}>
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
        {removeAsterisks(text)}
      </text>
    </view>
  );
}
export { SwiperItem };
