import { Machine } from 'stent';

Mousetrap.bind('ctrl+u', function (e) {
  Machine.get('Weather').refresh();
});
