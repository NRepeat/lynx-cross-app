import '../App.css';
import type { Picture } from '../Pictures/furnitures/furnituresPictures.jsx';
import LikeIcon from './LikeIcon.jsx';

export default function ImageCard(props: { picture: string; text: string }) {
  const { picture } = props;
  console.log('🚀 ~ ImageCard ~ props:', props);
  return (
    <view className="picture-wrapper">
      <image className="image" src={props.picture} />
      <LikeIcon />
      {/* <text className="text">{props.text}</text> */}
    </view>
  );
}
