import React from 'react';
import { Machine } from 'stent';
import AddNote from '../AddNote';

Mousetrap.bind('ctrl+u', function (e) {
  Machine.get('Weather').refresh();
});
Mousetrap.bind('ctrl+n', function (e) {
  Machine.get('Details').open(<AddNote />);
});
