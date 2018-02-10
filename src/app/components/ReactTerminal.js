import React from 'react';
import { Terminal } from 'xterm';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as search from 'xterm/lib/addons/search/search';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(search);
Terminal.applyAddon(winptyCompat);

export default class ReactTerminal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      command: ''
    };
  }
  componentDidMount() {
    let term, socket, socketURL = 'ws://0.0.0.0:3000/terminals/';

    this.term = term = new Terminal({
      cursorBlink: true
    });

    term.open(document.querySelector('#terminal'));
    term.winptyCompatInit();
    term.fit();
    term.focus();

    fetch('http://0.0.0.0:3000/terminals', { method: 'POST' }).then(function (res) {
      res.text().then(function (processId) {
        socketURL += processId;
        socket = new WebSocket(socketURL);
        socket.onopen = () => {
          term.attach(socket);
        };
        socket.onclose = () => console.log('onclose socket');
        socket.onerror = () => console.log('onerror socket');
      });
    });
  }
  render() {
    return <div id='terminal'></div>;
  }
};
