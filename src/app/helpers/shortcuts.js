import React from 'react';
import { Machine } from 'stent';
import Editor from '../Editor';

Mousetrap.bind('ctrl+u', function (e) {
  Machine.get('Weather').refresh();
});
Mousetrap.bind('ctrl+n', function (e) {
  Machine.get('Sidebar').open(<Editor />);
});
Mousetrap.bind('escape', function (e) {
  Machine.get('Sidebar').close();
});
