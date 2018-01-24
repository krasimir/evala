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
import './stent/Details';
import './helpers/shortcuts';
import { connect } from 'stent/lib/react';
import moment from 'moment';
import AddNote from './AddNote';

class App extends React.Component {
  _getNewTitle() {
    const { today } = this.props;

    return today ? `${ today.temperature }℃ | ${ moment().format('HH:mm') }` : null;
  }
  render() {
    const newTitle = this._getNewTitle();
    const { isDetailsOpen, detailsContent, closeDetails } = this.props;

    return (
      <div className={ `container ${ isDetailsOpen ? 'withDetails' : '' }` }>
        <Helmet>
          <style>{ getGlobalStyles(this.props.today) }</style>
          { newTitle && <title>{ newTitle }</title> }
        </Helmet>
        <Time />
        <Weather />
        <div className='notes'>
          <nav>
            <a className='button' onClick={ this.props.addNote }>
              <i className='fa fa-plus'></i>
              <small>Ctrl + n</small>
            </a>
            <a className='button'>
              <i className='fa fa-search'></i>
              <small>Ctrl + s</small>
            </a>
          </nav>
        </div>
        { isDetailsOpen && <div className='details'>
          <nav>
            <a className='close' onClick={ () => closeDetails() }><i className='fa fa-close'></i></a>
          </nav>
          { detailsContent }
        </div> }
      </div>
    );
  }
}

App.propTypes = {
  today: PropTypes.any,
  detailsContent: PropTypes.any,
  closeDetails: PropTypes.func,
  addNote: PropTypes.func,
  isDetailsOpen: PropTypes.bool
};

const AppConnected = connect(App)
  .with('Weather', 'Details')
  .map((weather, details) => ({
    today: weather.today(),
    isDetailsOpen: details.isOpened(),
    detailsContent: details.state.content,
    closeDetails: () => details.close(null),
    addNote: () => details.open(<AddNote />)
  }));

ReactDOM.render(<AppConnected />, document.querySelector('#container'));
