/* eslint-disable max-len */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import getGlobalStyles from './helpers/getGlobalStyles';
import ClockForecast from './components/ClockForecast';
import Editor from './components/Editor';
import Search from './components/Search';
import Calendar from './components/Calendar';
import Auth from './components/Auth';
import './helpers/debug';
import './stent/Weather';
import './stent/Sidebar';
import './stent/Notes';
import './stent/Auth';
import './helpers/shortcuts';
import './services/auth';
import { connect } from 'stent/lib/react';
import moment from 'moment';
import getId from './helpers/getId';
import { IS_INDEXDB_SUPPORTED, IS_LOCALSTORAGE_SUPPORTED } from './helpers/capabilities';

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
  _renderNotes() {
    if (!IS_INDEXDB_SUPPORTED || !IS_LOCALSTORAGE_SUPPORTED) {
      return (
        <small className='requiredAPIsError'>
          Required APIs are disabled or not supported. <a href='https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'>LocalStorage API</a> or <a href='https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API'>IndexedDB API</a>.
        </small>
      );
    }

    return (
      <div className='notes' key='notes'>
        <nav>
          <a className='button' onClick={ () => this.props.newNote() }>
            <i className='fa fa-plus'></i>
            <small>1</small>
          </a>
          <a className='button' onClick={ () => this.props.search() }>
            <i className='fa fa-search'></i>
            <small>2</small>
          </a>
          <a className='button' onClick={ () => this.props.calendar() }>
            <i className='fa fa-calendar-o'></i>
            <small>3</small>
          </a>
        </nav>
        { this._renderGroupedByTag() }
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
        <div>
          { this._renderNotes() }
          <Auth />
        </div>
        { sidebarContent && <div className='sidebar'>{ sidebarContent }</div> }
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
  .with('Weather', 'Sidebar', 'Notes')
  .map((weather, sidebar, notes) => ({
    today: weather.today(),
    sidebarContent: sidebar.state.content,
    newNote: () => sidebar.open(<Editor />),
    search: what => sidebar.open(<Search what={ what } key={ getId() }/>),
    calendar: () => sidebar.open(<Calendar />),
    notesByTag: notes.state.notesByTag
  }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));
