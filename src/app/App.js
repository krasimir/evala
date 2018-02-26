/* eslint-disable max-len */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import getGlobalStyles from './helpers/getGlobalStyles';
import TerminalWindow from './components/TerminalWindow';
import ClockForecast from './components/ClockForecast';
import Settings from './components/Settings';
import './helpers/debug';
import './stent/Weather';
import './helpers/shortcuts';
import { connect } from 'stent/lib/react';
import moment from 'moment';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { now: moment(), mode: 'clock-forecast' };
  }
  _getNewTitle() {
    const { today } = this.props;
    const { now } = this.state;

    return today ? `${ now.format('HH:mm') } / ${ today.temperature }°C` : null;
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
          <style>{ '.clockForecast{opacity:1;}' }</style>
          { newTitle && <title>{ newTitle }</title> }
        </Helmet>
        { this._renderContent() }
        { this.state.mode === 'clock-forecast' && <a className='openSettings' onClick={ () => this.setState({ mode: 'settings' })}><i className='fa fa-gear'></i></a> }
      </div>
    );
  }
  _renderContent() {
    switch (this.state.mode) {
      case 'clock-forecast':
        return <ClockForecast>{ () => this.setState({ mode: 'terminal' }) }</ClockForecast>;
      case 'terminal':
        return <TerminalWindow>{ () => this.setState({ mode: 'clock-forecast' }) }</TerminalWindow>;
      case 'settings':
        return <Settings>{ () => this.setState({ mode: 'clock-forecast' }) }</Settings>;
    }
    return null;
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
