import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import { connect } from 'stent/lib/react';
import linkifyjs from 'linkifyjs/html';
import Editor from './Editor';

const MAX_CONTENT_TO_BE_COLLAPSABLE = 340;

class Note extends React.Component {
  constructor(props) {
    super(props);

    const content = props.note.content || '';
    const collapsed = content
      .replace(/\r?\n|\r/g, '')
      .length > MAX_CONTENT_TO_BE_COLLAPSABLE;

    this.state = { collapsed };
  }
  _delete() {
    if (confirm('Are you sure?')) {
      this.props.delete(this.props.note.id);
    }
  }
  _collapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  }
  render() {
    const { content, id, done } = this.props.note;
    const { changeStatus, edit } = this.props;

    if (!content) return null;

    return (
      <div className={ `note note-${ done ? 'done' : 'notdone' } ${ !this.state.collapsed ? 'note-expanded' : '' }` }>
        <div className='noteMeta'>
          <a className='button' onClick={ () => changeStatus(id, !done) }>
            { done ? <i className='fa fa-check-square-o green'></i> : <i className='fa fa-square-o'></i> }
          </a>
          <a className='button' onClick={ () => edit(id, content) }>
            <i className='fa fa-pencil'></i>
          </a>
          <a className='button' onClick={ () => this._delete() }>
            <i className='fa fa-trash-o'></i>
          </a>
        </div>
        <div
          className='noteContent'
          dangerouslySetInnerHTML={{
            __html: linkifyjs(marked(content))
          }} />
        { this.state.collapsed && <a className='gradient' onClick={ () => this._collapsed() }></a> }
      </div>
    );
  }
};

Note.propTypes = {
  note: PropTypes.object,
  changeStatus: PropTypes.func,
  edit: PropTypes.func,
  delete: PropTypes.func
};

export default connect(Note)
  .with('Sidebar', 'Notes')
  .map((sidebar, notes) => ({
    changeStatus: (id, done) => notes.edit(id, { done }),
    edit: (id, content) => sidebar.open(<Editor id={ id } text={ content } />),
    delete: id => notes.delete(id)
  }));

