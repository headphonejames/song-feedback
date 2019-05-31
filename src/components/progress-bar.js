import { Direction, Slider } from 'react-player-controls'
import React from 'react';

const WHITE = '#fff';
const BUFFERED = '#e5def0';
const PLAYING = '#ffca01';

// A colored bar that will represent the current value
const SliderBar = ({ direction, value, style }) => (
    <div
        style={Object.assign({}, {
            position: 'absolute',
        }, direction === Direction.HORIZONTAL ? {
            top: 0,
            bottom: 0,
            left: 0,
            width: `${value * 100}%`,
        } : {
            right: 0,
            bottom: 0,
            left: 0,
            height: `${value * 100}%`,
        }, style)}
    />
);


// A composite progress bar component
export const ProgressBar = ({ isEnabled, direction, amountBuffered, value, ...props }) => (
    <Slider
        isEnabled={isEnabled}
        direction={direction}
        style={{
            width: "100%",
            background: WHITE,
            transition: direction === Direction.HORIZONTAL ? 'width 0.1s' : 'height 0.1s',
            cursor: isEnabled === true ? 'pointer' : 'default',
        }}
        {...props}
    >
        {/* Buffer bar */}
        <SliderBar direction={direction} style={{ background: BUFFERED, width: `${amountBuffered * 100}%`, opacity: 0.8 }} />
        <SliderBar direction={direction} value={value} style={{ background: PLAYING }} />
    </Slider>
);
