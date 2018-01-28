import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import Note from './Note';
import Editor from './Editor';
import getId from '../helpers/getId';

const ESCAPE = 27;
const NOTES_PER_PAGE = 15;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._exit = this._exit.bind(this);
    this._onInputKeydown = this._onInputKeydown.bind(this);
    this._nextPage = this._nextPage.bind(this);
    this._prevPage = this._prevPage.bind(this);
    this.state = {
      text: props.what || '',
      page: 0
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.input.focus();
      this.input.selectionStart = this.input.selectionEnd = 10000;
    }, 100);
    this._setShortcuts();
    this.props.search(this.state.text);
  }
  componentWillUnmount() {
    this._unsetShortcuts();
  }
  _exit() {
    this.props.exit();
  }
  _onChange(text) {
    this.setState({ text }, () => {
      this.props.search(text);
    });
  }
  _onInputKeydown(event) {
    if (event.keyCode === ESCAPE) {
      this._exit();
    }
  }
  _setShortcuts() {
    this.input && this.input.addEventListener('keydown', this._onInputKeydown);
  }
  _unsetShortcuts() {
    this.input && this.input.removeEventListener('keydown', this._onInputKeydown);
  }
  _nextPage() {
    this.setState({ page: this.state.page + 1 });
  }
  _prevPage() {
    this.setState({ page: this.state.page - 1 });
  }
  render() {
    var { notes } = this.props;
    var done = 0;
    const from = this.state.page * NOTES_PER_PAGE;
    const to = from + NOTES_PER_PAGE;
    const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);
    const pagination = notes.length > NOTES_PER_PAGE;
    
    notes.forEach((data, i) => {
      if (data.done) done += 1;
    });

    return (
      <div className='search'>
        <div>
          <input
            type='text'
            className='searchInput'
            ref={ input => (this.input = input) }
            value={ this.state.text }
            onChange={ event => this._onChange(event.target.value) } />
          <div className='progress'>
            <div className='progressBar' style={{ width: `${ Math.ceil(done / notes.length * 100) }%` }} />
          </div>
        </div>
        <div className='list'>
          { notes
            .slice(from, to)
            .map((note, i) => <Note note={ note } key={ `${ getId() }_${ i }` } />)
          }
          { pagination && <div className='pagination'>
            { this.state.page > 0 ? <a className='button' onClick={ this._prevPage }>
              <i className='fa fa-long-arrow-left'></i>
            </a> : <span></span> }
            <span>{ this.state.page + 1 } / { totalPages }</span>
            { this.state.page < totalPages - 1 ? <a className='button' onClick={ this._nextPage }>
              <i className='fa fa-long-arrow-right'></i>
            </a> : <span></span> }
          </div> }
        </div>
        <nav>
          <div>
            <a className='button close' onClick={ this._exit }><i className='fa fa-close'></i></a>
          </div>
        </nav>
      </div>
    );
  }
}

Search.propTypes = {
  exit: PropTypes.func,
  newNote: PropTypes.func,
  what: PropTypes.string,
  notes: PropTypes.array,
  search: PropTypes.func
};

export default connect(Search)
  .with('Sidebar', 'Notes')
  .map((sidebar, notes) => ({
    exit: () => sidebar.close(),
    search: str => notes.search(str),
    newNote: () => sidebar.open(<Editor />),
    notes: notes.state.filtered
  }));
