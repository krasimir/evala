import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import moment from 'moment';
import { connect } from 'stent/lib/react';
import linkifyjs from 'linkifyjs/html';
import Editor from './Editor';

class Note extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { content, created, tags, id, done } = this.props.note;
    const { changeStatus, edit } = this.props;

    if (!content) return null;

    return (
      <div className={ `note note-${ done ? 'done' : 'notdone' }` }>
        <div className='noteMeta'>
          <a className='button' onClick={ () => changeStatus(id, !done) }>
            { done ? <i className='fa fa-check-square-o green'></i> : <i className='fa fa-square-o'></i> }
          </a>
          <a className='button' onClick={ () => edit(id, content) }>
            <i className='fa fa-pencil'></i>
          </a>
          <a className='button' onClick={ () => null }>
            <i className='fa fa-trash-o'></i>
          </a>
        </div>
        <div
          className='noteContent'
          dangerouslySetInnerHTML={{
            __html: linkifyjs(marked(content))
          }} />
      </div>
    );
  }
};

Note.propTypes = {
  note: PropTypes.object,
  changeStatus: PropTypes.func,
  edit: PropTypes.func
};

export default connect(Note)
  .with('Sidebar', 'Notes')
  .map((sidebar, notes) => ({
    changeStatus: (id, done) => notes.edit(id, { done }),
    edit: (id, content) => sidebar.open(<Editor id={ id } text={ content } />)
  }));

/*

<strong>created</strong>: { moment(new Date(created)).format('MMMM Do YYYY, HH:MM') }<br />
          <strong>tags</strong>: { tags.join(', ') }<br />

          */

