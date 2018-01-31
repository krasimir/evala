import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import moment from 'moment';
import { ICONS_MAPPING } from '../constants';

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.now = moment();
    this._displayDays = this._displayDays.bind(this);
    this._displayHours = this._displayHours.bind(this);
    this.state = {
      display: null
    };
  }
  componentDidMount() {
    this.props.fetch();
  }
  _displayDays() {
    const newDisplay = this.state.display === 'days' ? null : 'days';

    this.setState({ display: newDisplay }, () => {
      this.props.openSidebar(newDisplay ? <div>{ this._renderDays() }</div> : null);
    });
  }
  _displayHours() {
    const newDisplay = this.state.display === 'hours' ? null : 'hours';

    this.setState({ display: newDisplay }, () => {
      this.props.openSidebar(newDisplay ? <div>{ this._renderHours() }</div> : null);
    });
  }
  _renderItem({ temperature, apparentTemperature, icon, sunset, sunrise }) {
    var isItDay = true;
    const now = moment();

    if (sunset && sunrise) {
      isItDay = now.isAfter(sunrise) && now.isBefore(sunset);
    }

    const iconClass = ICONS_MAPPING[icon][isItDay ? 0 : 1];

    return (
      <span>
        { iconClass && <i className={ `weatherIcon wi ${ iconClass }` }></i> }
        { temperature }<sup style={{ fontSize: '0.5em' }}>&#8451;</sup>
        <span style={{ opacity: 0.4} }>/{ apparentTemperature }<sup style={{ fontSize: '0.5em' }}>&#8451;</sup></span>
      </span>
    );
  }
  _renderDays() {
    const { data } = this.props;

    return data.days
      .filter(item => item.time.isAfter(this.now, 'day'))
      .map((item, i) => {
        return (
          <div key={ i }>
            { item.time.format('ddd (Do)') } <strong>{ this._renderItem(item) }</strong> { item.summary }
          </div>
        );
      });
  }
  _renderHours() {
    const { data } = this.props;

    return (
      <div>
        { data.hours
          .filter((item, i) => item.time.isAfter(this.now, 'hour'))
          .map((item, i) => {
            return (
              <div key={ i }>
                { item.time.format('Do HH:mm') } <strong>{ this._renderItem(item) }</strong> { item.summary }
              </div>
            );
          })
        }
      </div>
    );
  }
  render() {
    return null;
    const { state, data, lastUpdated, error } = this.props;

    if (state === 'no-data' || state === 'fetching') {
      return (
        <div className='weather' style={{ maxWidth: '500px' }}>
          <span className='big'>
            { Object.keys(ICONS_MAPPING).map((key, i) => {
              return <i key={ i } className={ `weatherIcon wi ${ ICONS_MAPPING[key][0] }` }></i>;
            })}
          </span>
        </div>
      );
    }

    if (state === 'error') {
      console.error(error);
      return <div className='weather'>Error getting<br />the weather information.</div>;
    }

    const today = data.days.find(day => day.time.isSame(this.now, 'day'));

    if (today) {
      return (
        <div className='weather'>
          <span className='big'>
            { this._renderItem(today) }
          </span>
          <span className='medium'>{ today.summary }</span>
          <span className='small'>{ lastUpdated.format('MMMM Do YYYY, HH:mm') }<br />{ data.timezone }</span>
          <span className='small'>
            <a onClick={ this._displayDays }><i className='fa fa-calendar'></i></a>
            <a onClick={ this._displayHours }><i className='fa fa-clock-o'></i></a>
          </span>
        </div>
      );
    }

    return (
      <div className='weather'>
        <small>
          No weather data for<br />{ this.now.format('MMMM Do YYYY') }<br />
          <a onClick={ () => this.props.fetch() }>Get some!</a>
        </small>
      </div>
    );
  }
};

Weather.propTypes = {
  state: PropTypes.string,
  fetch: PropTypes.func,
  openSidebar: PropTypes.func,
  error: PropTypes.any,
  data: PropTypes.any,
  lastUpdated: PropTypes.any
};

export default connect(Weather)
  .with('Weather', 'Sidebar')
  .map(({ state, fetch, refreshData }, sidebar) => ({
    state: state.name,
    data: state.data,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetch,
    openSidebar: content => sidebar.open(content)
  }));
