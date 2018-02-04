import React from 'react';
import { Machine } from 'stent';
import Editor from '../components/Editor';
import Search from '../components/Search';
import Calendar from '../components/Calendar';
import db from '../services/db';
import { IS_INDEXDB_SUPPORTED, IS_LOCALSTORAGE_SUPPORTED } from './capabilities';

if (IS_INDEXDB_SUPPORTED && IS_LOCALSTORAGE_SUPPORTED) {
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
  Mousetrap.bind('ctrl+shift+e', function (e) {
    db.notes.toArray().then(data => {
      console.log(JSON.stringify(data));
    });
  });
}
