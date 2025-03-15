function SwiperItem({
  pic,
  itemWidth,
}: {
  pic: string;
  itemWidth: number;
  text: string;
}) {
  return (
    <view style={{ width: `${itemWidth}px`, minHeight: `100%` }}>
      <image
        mode="aspectFill"
        src={pic}
        style={{ width: '100%', minHeight: `200px` }}
      ></image>
    </view>
  );
}
export { SwiperItem };
