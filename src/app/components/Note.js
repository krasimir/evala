import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import moment from 'moment';
import linkifyjs from 'linkifyjs';

export default class Note extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { content, created, tags } = this.props.note;

    return (
      <div className='note'>
        <div className='noteMeta'>
          <strong>created</strong>: { moment(created).format('MMMM Do YYYY, HH:MM') }<br />
          <strong>tags</strong>: { tags.join(', ') }<br />
        </div>
        <div
          className='noteContent'
          dangerouslySetInnerHTML={{
            __html: marked(linkifyjs(content))
          }} />
      </div>
    );
  }
};

Note.propTypes = {
  note: PropTypes.object
};

