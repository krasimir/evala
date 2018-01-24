import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import Editor from 'react-medium-editor';
import AutoList from 'medium-editor-autolist';
// import linkifyHtml from 'linkifyjs/html';

const EDITOR_OPTIONS = {
  toolbar: {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
  },
  placeholder: {
    text: '',
    hideOnClick: true
  },
  extensions: {
    autolist: AutoList
  }
};

class AddNote extends React.Component {
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
        if (
          this.editableArea &&
          this.editableArea.innerHTML !== '' &&
          this.editableArea.innerHTML !== '<p><br></p>'
        ) {
          this.setState({ text: '' }, () => (this.editableArea.innerHTML = ''));
        } else {
          this.props.exit();
        }
      }
      if (event.ctrlKey && event.keyCode === 13) {
        console.log('save');
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

AddNote.propTypes = {
  exit: PropTypes.func
};

export default connect(AddNote)
  .with('Details')
  .map(details => ({
    exit: () => details.close()
  }));
