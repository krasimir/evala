import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import getGlobalStyles from './helpers/getGlobalStyles';
import Time from './Time';
import Weather from './Weather';
import './stent/debug';
import './stent/Weather';
import './helpers/shortcuts';
import { connect } from 'stent/lib/react';
import moment from 'moment';

class App extends React.Component {
  _getNewTitle() {
    const { today } = this.props;

    return today ? `${ today.temperature }℃ | ${ moment().format('HH:mm') }` : null;
  }
  render() {
    const newTitle = this._getNewTitle();

    return (
      <div className="container">
        <Helmet>
          <style>{ getGlobalStyles(this.props.today) }</style>
          { newTitle && <title>{ newTitle }</title> }
        </Helmet>
        <Time />
        <Weather />
        <div className='notes'></div>
      </div>
    );
  }
}

App.propTypes = {
  today: PropTypes.any
};

const AppConnected = connect(App)
  .with('Weather')
  .map(weather => ({
    today: weather.today()
  }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));
