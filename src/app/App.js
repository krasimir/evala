/* eslint-disable max-len */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import getGlobalStyles from './helpers/getGlobalStyles';
import ClockForecast from './components/ClockForecast';
import TerminalWindow from './components/TerminalWindow';
import './helpers/debug';
import './stent/Weather';
import './helpers/shortcuts';
import { connect } from 'stent/lib/react';
import moment from 'moment';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { now: moment() };
  }
  _getNewTitle() {
    const { today } = this.props;
    const { now } = this.state;

    return today ? `${ today.temperature }℃ | ${ now.format('HH:mm') }` : null;
  }
  componentDidMount() {
    this.props.fetch();
    this._interval = setInterval(() => {
      this.setState({ now: moment() });
    }, 10000);
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  render() {
    const newTitle = this._getNewTitle();

    return (
      <div className='container'>
        <Helmet>
          <style>{ getGlobalStyles(this.props.today) }</style>
          <style>{ '.terminalWindow{opacity:1;transform:translateY(0);}' }</style>
          { newTitle && <title>{ newTitle }</title> }
        </Helmet>
        {/* <ClockForecast /> */}
        <TerminalWindow />
      </div>
    );
  }
}

App.propTypes = {
  today: PropTypes.any,
  fetch: PropTypes.func
};

const AppConnected = connect(App)
  .with('Weather')
  .map((weather) => ({
    today: weather.today(),
    fetch: weather.fetch
  }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));
