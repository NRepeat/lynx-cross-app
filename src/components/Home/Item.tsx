import { useCallback } from '@lynx-js/react/legacy-react-runtime';
import { useNavigate } from 'react-router';
import { calculateEstimatedSize } from '../../utils/utils.jsx';
import Icon from '../ui/Icon.jsx';
import check from '../../assets/check.png';
export const VerticalScrollItem = (props: { title: string; link: string }) => {
  const nav = useNavigate();
  const handleNavigate = useCallback(() => {
    nav(props.link);
    console.info(`Navigating to ${props.link}`);
  }, [nav, props.link]);
  return (
    <list-item
      //   estimated-main-axis-size-px={calculateEstimatedSize(50, 340)}
      item-key={'' + props.link}
      key={'' + props.link}
      bindtap={handleNavigate}
    >
      <view className="home-list-item">
        <view className="check-icon">
          <Icon src={check} className="check-icon-inner" />
        </view>
        <text>{props.title}</text>
      </view>
      {/* <image
          style={{ width: "calc(100% - 10px)", height: "160px" }}
          src={props.index % 3 == 0 ? image_0 : (props.index % 3 == 1 ? image_1 : image_2)}
        /> */}
    </list-item>
  );
};
