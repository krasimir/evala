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
import './stent/Sidebar';
import './stent/Notes';
import './helpers/shortcuts';
import { connect } from 'stent/lib/react';
import moment from 'moment';
import Editor from './Editor';

function removeHash(tag) {
  if (tag.charAt(0) === '#') {
    return tag.substr(1, tag.length);
  }
  return tag;
}

class App extends React.Component {
  _getNewTitle() {
    const { today } = this.props;

    return today ? `${ today.temperature }℃ | ${ moment().format('HH:mm') }` : null;
  }
  _renderNotesSummary() {
    const { notes } = this.props;
    console.log(notes);

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
          <a key={ i } className='tagSummaryLink'>
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
            <a className='button' onClick={ this.props.newNote }>
              <i className='fa fa-plus'></i>
              <small>Ctrl + n</small>
            </a>
            <a className='button'>
              <i className='fa fa-search'></i>
              <small>Ctrl + f</small>
            </a>
          </nav>
          { this._renderNotesSummary() }
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
  isSidebarOpen: PropTypes.bool,
  notes: PropTypes.array
};

const AppConnected = connect(App)
  .with('Weather', 'Sidebar', 'Notes')
  .map((weather, sidebar, notes) => ({
    today: weather.today(),
    sidebarContent: sidebar.state.content,
    newNote: () => sidebar.open(<Editor />),
    notes: notes.state.notes
  }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));
