import React from 'react';
import { Terminal as XTerminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
// import PropTypes from 'prop-types';

export default class Terminal extends React.Component {
  componentDidMount() {
    XTerminal.applyAddon(fit);

    this.term = new XTerminal({
      cursorBlink: true
    });

    this.term.open(document.getElementById('terminal'));
    this.term.on('data', data => {
      console.log(data);
    });
    this.term.focus();
    this.term.fit();
  }
  render() {
    return <div id='terminal'></div>;
  }
};
