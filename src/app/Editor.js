import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import Editor from 'react-medium-editor';

const EDITOR_OPTIONS = {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  placeholder: {
    text: '',
    hideOnClick: true
  }
};

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._save = this._save.bind(this);
    this.state = { text: '' };
  }
  get editableArea() {
    if (this.editor) {
      return this.editor.querySelector('[contenteditable]');
    }
    return null;
  }
  componentDidMount() {
    setTimeout(() => {
      this.editableArea && this.editableArea.focus();
      this._setShortcuts();
    }, 300);
  }
  componentWillUnmount() {
    Mousetrap.unbind('ctrl+enter');
  }
  _save() {
    console.log('save');
  }
  _onChange(text) {
    this.setState({ text });
  }
  _setShortcuts() {
    if (!this.medium) return;

    this.medium.subscribe('editableKeydown', event => {
      if (event.keyCode === 27) {
        this.props.exit();
      }
      if (event.ctrlKey && event.keyCode === 13) {
        this.props.createNote(this.state.text);
        this.props.exit();
      }
    });
  }
  render() {
    return (
      <div className='editor' ref={ editor => (this.editor = editor) }>
        <Editor
          tag="div"
          ref={ editor => {
            if (editor) this.medium = editor.medium;
          }}
          text={ this.state.text }
          onChange={ this._onChange }
          options={ EDITOR_OPTIONS }
        />
      </div>
    );
  }
}

Editor.propTypes = {
  exit: PropTypes.func,
  createNote: PropTypes.func
};

export default connect(Editor)
  .with('Sidebar', 'Notes')
  .map((sidebar, notes) => ({
    exit: () => sidebar.close(),
    createNote: content => notes.createNote(content)
  }));
