import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import extractTags from '../helpers/extractTags';
import intersection from 'lodash.intersection';
import Note from './Note';
import Editor from './Editor';

const ESCAPE = 27;
const N = 78;

const searchCriteria = text => text.split(/ /gi).reduce((result, token) => {
  const tags = extractTags(token);

  if (tags && tags.length > 0) {
    result.tags = result.tags.concat(tags);
  } else if (token !== '' && token !== ' ' && token.length >= 2) {
    result.text.push(token);
  }

  return result;
}, { tags: [], text: [] });

class Search extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._exit = this._exit.bind(this);
    this._onInputKeydown = this._onInputKeydown.bind(this);
    this.state = { text: props.what || '' };
  }
  componentDidMount() {
    setTimeout(() => {
      this.input.focus();
      this.input.selectionStart = this.input.selectionEnd = 10000;
    }, 100);
    this._setShortcuts();
  }
  componentWillUnmount() {
    this._unsetShortcuts();
  }
  _exit() {
    this.props.exit();
  }
  _onChange(text) {
    this.setState({ text });
  }
  _onInputKeydown(event) {
    if (event.keyCode === ESCAPE) {
      this._exit();
    } else if (event.ctrlKey && event.keyCode === N) {
      this.props.newNote();
    }
  }
  _setShortcuts() {
    this.input && this.input.addEventListener('keydown', this._onInputKeydown);
  }
  _unsetShortcuts() {
    this.input && this.input.removeEventListener('keydown', this._onInputKeydown);
  }
  render() {
    const criteria = searchCriteria(this.state.text);
    var filtered = this.props.notes;

    if (criteria.tags.length === 0 && criteria.text.length === 0) {
      filtered = [];
    } else {
      if (criteria.tags.length > 0) {
        filtered = filtered.filter(note => {
          if (!note.tags || note.tags.length === 0) return false;
          return intersection(note.tags, criteria.tags).length === criteria.tags.length;
        });
      }
      if (criteria.text.length > 0) {
        filtered = filtered.filter(note => criteria.text.reduce((ok, t) => {
          if (ok) return ok;
          return note.content.match(new RegExp(t, 'gi'));
        }, false));
      }
    }

    return (
      <div className='search'>
        <div>
          <input
            type='text'
            className='searchInput'
            ref={ input => (this.input = input) }
            value={ this.state.text }
            onChange={ event => this._onChange(event.target.value) } />
          <hr />
          {
            filtered.map((data, i) => <Note key={ i } note={ data } />)
          }
        </div>
        <nav>
          <div>
            <a className='button close' onClick={ this._exit }><i className='fa fa-close'></i></a>
          </div>
          <div>

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
  notes: PropTypes.array
};

export default connect(Search)
  .with('Sidebar', 'Notes')
  .map((sidebar, notes) => ({
    exit: () => sidebar.close(),
    notes: notes.state.notes,
    newNote: () => sidebar.open(<Editor />)
  }));
