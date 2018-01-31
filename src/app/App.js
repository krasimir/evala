import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import getGlobalStyles from './helpers/getGlobalStyles';
import Time from './components/Time';
import Weather from './components/Weather';
import Editor from './components/Editor';
import Search from './components/Search';
import './helpers/debug';
import './stent/Weather';
import './stent/Sidebar';
import './stent/Notes';
import './helpers/shortcuts';
import { connect } from 'stent/lib/react';
import moment from 'moment';
import getId from './helpers/getId';

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
        <div>
          <Time />
          <Weather />
        </div>
        <div className='notes'>
          <nav>
            <a className='button' onClick={ () => this.props.newNote() }>
              <i className='fa fa-plus'></i>
              <small>Enter</small>
            </a>
            { /* <a className='button' onClick={ () => this.props.search() }>
              <i className='fa fa-list-ul'></i>
              <small>Shift + Enter</small>
              </a> */ }
          </nav>
          { this._renderGroupedByTag() }
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
    notesByTag: notes.state.notesByTag
  }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));
