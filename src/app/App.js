/* eslint-disable max-len */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import getGlobalStyles from './helpers/getGlobalStyles';
import ClockForecast from './components/ClockForecast';
import './helpers/debug';
import './stent/Weather';
import './helpers/shortcuts';
import { connect } from 'stent/lib/react';
import moment from 'moment';

function removeHash(tag) {
  if (tag.charAt(0) === '#') {
    return tag.substr(1, tag.length);
  }
  return tag;
}

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
    this._interval = setInterval(() => {
      this.setState({ now: moment() });
    }, 10000);
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  _renderGroupedByTag() {
    const { notesByTag } = this.props;

    const sortedByCount = Object.keys(notesByTag)
      .map(tag => ([ tag, notesByTag[tag]]))
      .sort((a, b) => (b[1] - a[1]));

    return (
      <div className='summary'>
        { sortedByCount.map(([tag, count], i) =>
          <a key={ i } className='tagSummaryLink' onClick={ () => this.props.search(tag) }>
            <i className='fa fa-hashtag'></i>{ removeHash(tag) }
            { count > 1 && <sup>{ count }</sup> }
          </a>
        )}
      </div>
    );
  }
  render() {
    const newTitle = this._getNewTitle();
    const { sidebarContent } = this.props;

    return (
      <div className={ `container ${ sidebarContent ? 'withSidebar' : '' }` }>
        <Helmet>
          <style>{ getGlobalStyles(this.props.today) }</style>
          { newTitle && <title>{ newTitle }</title> }
        </Helmet>
        <ClockForecast />
      </div>
    );
  }
}

App.propTypes = {
  today: PropTypes.any,
  sidebarContent: PropTypes.any,
  closeSidebar: PropTypes.func,
  newNote: PropTypes.func,
  search: PropTypes.func,
  calendar: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
  notesByTag: PropTypes.object
};

const AppConnected = connect(App)
  .with('Weather')
  .map((weather) => ({
    today: weather.today()
  }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));
