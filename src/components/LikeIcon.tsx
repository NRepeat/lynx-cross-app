import { useEffect, useState } from '@lynx-js/react';
import redHeart from '../Pictures/redHeart.png';
import whiteHeart from '../Pictures/whiteHeart.png';
import '../App.css';
import { useFavWods } from '../hooks/useFavWods.js';

export default function LikeIcon({ wodId }: { wodId: string | undefined }) {
  const state = useFavWods();

  const [isLiked, setIsLiked] = useState<boolean>(
    state.isFavWod(wodId as string),
  );

  const onTap = () => {
    state.addFavWods([wodId as string]);
    console.log('isLiked', wodId);
    setIsLiked((prev) => {
      if (prev) {
        state.removeFavWods([wodId as string]);
        return !prev;
      } else {
        state.addFavWods([wodId as string]);
        return !prev;
      }
      return !prev;
    });
  };
  return (
    <view className="like-icon" bindtap={onTap}>
      {isLiked && <view className="circle" />}
      {isLiked && <view className="circle circleAfter" />}
      <image src={isLiked ? redHeart : whiteHeart} className="heart-love" />
    </view>
  );
}
