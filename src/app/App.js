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
    setInterval(() => {
      this.setState({ now: moment() });
    }, 10000);
  }
  _renderGroupedByTag() {
    const { notes } = this.props;

    if (notes === null || notes.length === 0) return null;

    const groupedByTag = notes.reduce((result, note) => {
      if (!note.tags || note.tags.length === 0) {
        if (!result['#notag']) result['#notag'] = 0;
        result['#notag'] += 1;
      } else {
        note.tags.forEach(tag => {
          if (!result[tag]) result[tag] = 0;
          result[tag] += 1;
        });
      }
      return result;
    }, {});

    return (
      <div className='summary'>
        { Object.keys(groupedByTag).map((tag, i) =>
          <a key={ i } className='tagSummaryLink' onClick={ () => this.props.search(tag) }>
            <i className='fa fa-hashtag'></i>{ removeHash(tag) }
            { groupedByTag[tag] > 1 && <sup>{ groupedByTag[tag] }</sup> }
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
        <Time />
        <Weather />
        <div className='notes'>
          <nav>
            <a className='button' onClick={ () => this.props.newNote() }>
              <i className='fa fa-plus'></i>
              <small>Ctrl + n</small>
            </a>
            <a className='button' onClick={ () => this.props.search() }>
              <i className='fa fa-search'></i>
              <small>Ctrl + f</small>
            </a>
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
  notes: PropTypes.array
};

const AppConnected = connect(App)
  .with('Weather', 'Sidebar', 'Notes')
  .map((weather, sidebar, notes) => ({
    today: weather.today(),
    sidebarContent: sidebar.state.content,
    newNote: () => sidebar.open(<Editor />),
    search: what => sidebar.open(<Search what={ what } />),
    notes: notes.state.notes
  }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));
