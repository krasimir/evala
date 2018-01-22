import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import getGlobalStyles from './helpers/getGlobalStyles';
import Time from './Time';
import Weather from './Weather';
import './stent/debug';
import './stent/Weather';
import './helpers/shortcuts';

class App extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <style>{ getGlobalStyles() }</style>
        </Helmet>
        <Time />
        <Weather />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#container'));
