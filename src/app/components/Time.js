import React from 'react';
import moment from 'moment';

const CLOCK_SIZE = 300;
const CLOCK_CENTER = { x: CLOCK_SIZE / 2, y: CLOCK_SIZE / 2};

function getClockItemStylse(hour) {
  const deg = (hour % 12 / 12) * 360;

  return {
    top: `${ CLOCK_CENTER.x + (Math.cos(deg) * CLOCK_SIZE) }px`,
    left: `${ CLOCK_CENTER.y + (Math.cos(deg) * CLOCK_SIZE) }px`
  };
}

export default class Time extends React.Component {
  constructor(props) {
    super(props);

    this.state = { moment: moment() };
    this._interval = setInterval(() => {
      this.setState({ moment: moment() });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  render() {
    return (
      <div className='time'>
        <ul>
          <li style={ getClockItemStylse(0) }>12</li>
          <li style={ getClockItemStylse(1) }>1</li>
          <li style={ getClockItemStylse(2) }>2</li>
          <li style={ getClockItemStylse(3) }>3</li>
          <li style={ getClockItemStylse(4) }>4</li>
          <li style={ getClockItemStylse(5) }>5</li>
          <li style={ getClockItemStylse(6) }>6</li>
          <li style={ getClockItemStylse(7) }>7</li>
          <li style={ getClockItemStylse(8) }>8</li>
          <li style={ getClockItemStylse(9) }>9</li>
          <li style={ getClockItemStylse(10) }>10</li>
          <li style={ getClockItemStylse(11) }>11</li>
        </ul>
      </div>
    );
  }
};

{/* <span className='big'>{ this.state.moment.format('HH:mm') }</span>
<span className='medium'>{ this.state.moment.format('MMMM Do YYYY') }</span>
<span className='small'>Happy { this.state.moment.format('dddd') }!</span> */}
