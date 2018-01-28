import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import Note from './Note';
import Editor from './Editor';
import getId from '../helpers/uid';

const ESCAPE = 27;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._exit = this._exit.bind(this);
    this._onInputKeydown = this._onInputKeydown.bind(this);
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
  componentWillReceiveProps(newProps) {
    if (newProps.what !== this.state.text) {
      this.setState({ text: newProps.what || '' });
      this.props.search(newProps.what);
    }
  }
  _exit() {
    this.props.exit();
  }
  _onChange(text) {
    this.setState({ text });
    this.props.search(this.state.text);
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
  render() {
    var { notes } = this.props;
    var done = 0;

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
            .slice(0, (this.state.page + 1) * 10)
            .map((note, i) => <Note note={ note } key={ `${ getId() }_${ i }` } />)
          }
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
