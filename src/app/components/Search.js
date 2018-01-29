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
    this._changeStatus = this._changeStatus.bind(this);
    this.state = {
      text: props.what || '',
      page: 0,
      notes: props.notes
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
  componentWillReceiveProps(newProps) {
    if (newProps.notes) {
      this.setState({ notes: newProps.notes });
    }
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
  _changeStatus(id, done) {
    this.props.changeStatus(id, done);
    this.setState({
      notes: this.state.notes.map(note => {
        if (note.id === id) note.done = done;
        return note;
      })
    });
  }
  render() {
    var done = 0;
    const { notes, page } = this.state;
    const from = page * NOTES_PER_PAGE;
    const to = from + NOTES_PER_PAGE;
    const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);
    const pagination = notes.length > NOTES_PER_PAGE;

    notes.forEach(note => {
      if (note.done) done += 1;
    });

    const progressBarValue = notes.length > 0 ? Math.ceil(done / notes.length * 100) : 0;

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
            <div className='progressBar' style={{ width: `${ progressBarValue }%` }} />
          </div>
        </div>
        <div className='list'>
          { notes
            .slice(from, to)
            .map((note, i) => (
              <Note
                note={ note }
                key={ `${ getId() }_${ i }` }
                changeStatus={ this._changeStatus } />
            )) }
          { pagination && <div className='pagination'>
            { page > 0 ? <a className='button' onClick={ this._prevPage }>
              <i className='fa fa-long-arrow-left'></i>
            </a> : <span></span> }
            <span>{ page + 1 } / { totalPages }</span>
            { page < totalPages - 1 ? <a className='button' onClick={ this._nextPage }>
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
  search: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired
};

export default connect(Search)
  .with('Sidebar', 'Notes')
  .map((sidebar, notes) => ({
    exit: () => sidebar.close(),
    search: str => notes.search(str),
    changeStatus: (id, done) => notes.changeStatus(id, done),
    newNote: () => sidebar.open(<Editor />),
    notes: notes.state.filtered
  }));
