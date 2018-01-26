import React from 'react';
import moment from 'moment';

export default class Time extends React.Component {
  constructor(props) {
    super(props);

    this.state = { moment: moment() };
    setInterval(() => {
      this.setState({ moment: moment() });
    }, 1000);
  }
  render() {
    return (
      <div className='time'>
        <span className='big'>{ this.state.moment.format('HH:mm') }</span>
        <span className='medium'>{ this.state.moment.format('MMMM Do YYYY') }</span>
        <span className='small'>Happy { this.state.moment.format('dddd') }!</span>
      </div>
    );
  }
};
