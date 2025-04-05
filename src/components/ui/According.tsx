import { useState } from '@lynx-js/react/legacy-react-runtime';
import './styles.css';

export const AccordionItem = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleItem = () => {
    setIsActive(!isActive);
  };
  return (
    <view className={`accordion-item ${isActive ? 'active' : ''}`}>
      <view
        className="accordion-header"
        bindtap={toggleItem}
        style={{ transition: 'background-color 0.5s' }}
      >
        <text>{title}</text>
        <text
          className={`icon ${isActive ? 'rotate' : ''}`}
          style={{ transition: 'transform 0.5s' }}
        >
          ▼
        </text>
      </view>
      <view
        className="accordion-content"
        // use 200px to estimate the height
        style={{
          //   maxHeight: isActive ? '100px' : '14px',
          height: isActive ? 'auto' : '0px',
          transition: 'height 2s linear',
        }}
      >
        <text className="content">{content}</text>
      </view>
    </view>
  );
};

export const Accordion = ({ children }: { children: React.ReactNode }) => {
  return (
    <view className="accordion">
      {children}
      {/* {items.map((item, index) => <AccordionItem key={index} title={item.title} content={item.content} />)} */}
    </view>
  );
};
