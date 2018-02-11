#!/usr/bin/env node

var terminals = {}, logs = {};

const PORT = require('./config').PORT;
const express = require('express');
const app = express();
const os = require('os');
const pty = require('node-pty');
const argv = require('yargs').argv;

require('express-ws')(app);

app.post('/terminals', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  console.log('SHELL: "' + argv.shell + '"');

  let shell = argv.shell && argv.shell !== '' ? argv.shell : process.platform === 'win32' ? 'cmd.exe' : 'bash';
  let cols = parseInt(req.query.cols, 10);
  let rows = parseInt(req.query.rows, 10);
  let term = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: cols || 80,
    rows: rows || 24,
    cwd: process.env.PWD,
    env: process.env
  });

  console.log('Created terminal with PID: ' + term.pid);
  terminals[term.pid] = term;
  logs[term.pid] = '';
  term.on('data', function (data) {
    logs[term.pid] += data;
  });
  res.send(term.pid.toString());
  res.end();
});

app.post('/terminals/:pid/size', function (req, res) {
  let pid = parseInt(req.params.pid, 10);
  let cols = parseInt(req.query.cols, 10);
  let rows = parseInt(req.query.rows, 10);
  let term = terminals[pid];

  term.resize(cols, rows);
  console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
  res.end();
});

app.use('/', express.static(__dirname + '/../build'));

app.ws('/terminals/:pid', function (ws, req) {
  var term = terminals[parseInt(req.params.pid, 10)];

  console.log('Connected to terminal ' + term.pid);
  ws.send(logs[term.pid]);

  term.on('data', function (data) {
    // console.log('Incomming data = ' + data);
    try {
      ws.send(data);
    } catch (ex) {
      // The WebSocket is not open, ignore
    }
  });
  ws.on('message', function (msg) {
    term.write(msg);
  });
  ws.on('close', function () {
    term.kill();
    console.log('Closed terminal ' + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});

let port = argv.port || PORT;
let host = os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0';

if (!port) {
  console.error('Please provide a port: node ./src/server.js --port=XXXX');
  process.exit(1);
} else {
  app.listen(port, host);
  console.log('Server listening at http://' + host + ':' + port);
}
