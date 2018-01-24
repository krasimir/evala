import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import Editor from 'react-medium-editor';

const EDITOR_OPTIONS = {
  toolbar: {
    buttons: ['bold', 'italic', 'underline']
  },
  placeholder: {
    text: '',
    hideOnClick: true
  },
  keyboardCommands: {
    commands: [
      {
        command: 'bold',
        key: 'B',
        meta: true,
        shift: false,
        alt: false
      },
      {
        command: 'italic',
        key: 'I',
        meta: true,
        shift: false,
        alt: false
      },
      {
        command: 'underline',
        key: 'U',
        meta: true,
        shift: false,
        alt: false
      }
    ]
  }
};

class AddNote extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._save = this._save.bind(this);
    this.state = { text: '' };
  }
  componentDidMount() {
    setTimeout(() => {
      const editableArea = this.editor.querySelector('[contenteditable]');

      editableArea.focus();
      this.medium.subscribe('editableKeydown', event => {
        if (event.keyCode === 27) {
          if (editableArea.innerHTML !== '' && editableArea.innerHTML !== '<p><br></p>') {
            this.setState({ text: '' }, () => {
              editableArea.innerHTML = '';
            });
          } else {
            this.props.exit();
          }
        }
        if (event.ctrlKey && event.keyCode === 13) {
          console.log('save');
        }
      });
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
