/* eslint-disable no-use-before-define */
import React from 'react';
import PropTypes from 'prop-types';
import { Terminal } from 'xterm';
// import * as attach from 'xterm/lib/addons/attach/attach';
import * as attach from '../addons/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as search from 'xterm/lib/addons/search/search';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import { PORT } from '../../config';
import getId from '../helpers/getId';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(search);
Terminal.applyAddon(winptyCompat);

const HOST = `127.0.0.1:${ PORT }`;
const SOCKET_URL = `ws://${ HOST }/terminals/`;

export default class ReactTerminal extends React.Component {
  constructor(props) {
    super(props);

    this.elementId = `terminal_${ getId() }`;
    this.failures = 0;
    this.interval = null;
    this.state = {
      command: ''
    };
  }
  componentDidMount() {
    this.term = new Terminal({
      cursorBlink: true,
      rows: 3
    });

    this.term.open(document.querySelector(`#${ this.elementId }`));
    this.term.winptyCompatInit();
    this.term.fit();
    this.term.focus();
    this.term.on('resize', ({ cols, rows }) => {
      if (!this.pid) return;
      fetch(`http://${ HOST }/terminals/${ this.pid }/size?cols=${ cols }&rows=${ rows }`, { method: 'POST' });
    });
    this._connectToServer();

    if (this.props.children && typeof this.props.children === 'function') {
      this.props.children(this.term);
    }
    listenToWindowResize(() => {
      this.term.fit();
    });
    this.term.fit();
  }
  componentWillUnmount() {
    clearTimeout(this.interval);
  }
  render() {
    return <div id={ this.elementId } style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>;
  }
  _connectToServer() {
    fetch(
      `http://${ HOST }/terminals/?cols=${ this.term.cols }&rows=${ this.term.rows }`,
      { method: 'POST' }
    ).then(
      res => {
        if (!res.ok) {
          this.failures += 1;
          if (this.failures === 2) {
            this.term.writeln('There is back-end server found but it returns "' + res.status + ' ' + res.statusText + '".');
          }
          this._tryAgain();
          return;
        }
        res.text().then(processId => {
          this.pid = processId;
          this.socket = new WebSocket(SOCKET_URL + processId);
          this.socket.onopen = () => {
            this.term.attach(this.socket);
          };
          this.socket.onclose = () => {
            this.term.writeln('Server disconnected!');
            this._connectToServer();
          };
          this.socket.onerror = () => {
            this.term.writeln('Server disconnected!');
            this._connectToServer();
          };
        });
      },
      error => {
        this.failures += 1;
        if (this.failures === 2) {
          this.term.writeln('It looks like there is no backend. You have to:');
          this.term.writeln('> npm install evala -g');
          this.term.writeln('> evala --shell=$SHELL');
        }
        console.error(error);
        this._tryAgain();
      }
    );
  }
  _tryAgain() {
    clearTimeout(this.interval);
    this.interval = setTimeout(() => {
      this._connectToServer();
    }, 2000);
  }
};

ReactTerminal.propTypes = {
  children: PropTypes.func
};

function listenToWindowResize(callback) {
  var resizeTimeout;

  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        callback();
      }, 66);
    }
  }

  window.addEventListener('resize', resizeThrottler, false);
}
