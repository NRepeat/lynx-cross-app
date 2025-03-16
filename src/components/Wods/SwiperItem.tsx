import { WorkoutComponent } from './WorkoutComponent.jsx';
import type { SlideWorkoutType } from './Swiper.jsx';
import type { WorkoutType } from './Wods.jsx';
import Icon from '../ui/Icon.jsx';
import chevronLeft from '../../assets/chevron-left.png';
import user from '../../assets/user.png';
import { useLocation, useNavigate } from 'react-router';
function SwiperItem({
  pic,
  workout,
  title,
  itemWidth,
}: {
  pic: string;
  itemWidth: number;

  title: string;
  workout: (WorkoutType<'women', "Rx'd"> | WorkoutType<'men', "Rx'd">)[];
}) {
  function removeAsterisks(text: string): string {
    return text.replace(/\*/g, '');
  }
  const location = useLocation();
  const nav = useNavigate();
  const handleBack = () => {
    nav(-1);
  };
  const handleHome = () => {
    nav('/');
  };
  return (
    <view style={{ width: `${itemWidth}px` }} className="swiper-item">
      {/* <image
        mode="aspectFill"
        src={pic}
        style={{ width: '100%', minHeight: `200px` }}
      ></image> */}
      {/* <view className="header">
        {title !== 'Home' ? (
          <Icon
            className="header-back"
            bindtap={handleBack}
            src={chevronLeft}
          />
        ) : (
          <view style={{ width: '24px' }} />
        )}
        <text bindtap={handleHome} className="header__title">
          {title}
        </text>
        <Icon className="header-user" src={user} />
      </view> */}
      <text class="title">{title}</text>

      <WorkoutComponent workout={workout[0]} />
    </view>
  );
}
export { SwiperItem };
