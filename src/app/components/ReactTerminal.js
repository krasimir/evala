import React from 'react';
import { Terminal } from 'xterm';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as search from 'xterm/lib/addons/search/search';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import { PORT } from '../../config';

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

    this.state = {
      command: ''
    };
  }
  _connectToServer() {
    fetch(
      `http://${ HOST }/terminals/?cols=${ this.term.cols }&rows=${ this.term.rows }`,
      { method: 'POST' }
    ).then(
      res => {
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
        console.error(error);
        setTimeout(() => {
          this._connectToServer();
        }, 2000);
      }
    );
  }
  componentDidMount() {
    this.term = new Terminal({
      cursorBlink: true
    });

    this.term.open(document.querySelector('#terminal'));
    this.term.winptyCompatInit();
    this.term.fit();
    this.term.focus();
    this.term.on('resize', size => {
      if (!this.pid) return;
      let cols = size.cols;
      let rows = size.rows;
      let url = `http://${ HOST }/terminals/${ this.pid }/size?cols=${ cols }&rows=${ rows }`;

      fetch(url, { method: 'POST' });
    });
    this._connectToServer();
  }
  render() {
    return <div id='terminal'></div>;
  }
};
