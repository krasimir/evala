import React from 'react';
import { Machine } from 'stent';
import Editor from '../components/Editor';
import Search from '../components/Search';
import Calendar from '../components/Calendar';

Mousetrap.bind('ctrl+u', function (e) {
  Machine.get('Weather').refresh();
});
Mousetrap.bind('1', function (e) {
  Machine.get('Sidebar').open(<Editor />);
});
Mousetrap.bind('2', function (e) {
  Machine.get('Sidebar').open(<Search />);
});
Mousetrap.bind('3', function (e) {
  Machine.get('Sidebar').open(<Calendar />);
});
Mousetrap.bind('escape', function (e) {
  Machine.get('Sidebar').close();
});
