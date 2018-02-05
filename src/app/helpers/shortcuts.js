import { Machine } from 'stent';
import { IS_LOCALSTORAGE_SUPPORTED } from './capabilities';

if (IS_LOCALSTORAGE_SUPPORTED) {
  Mousetrap.bind('ctrl+u', function (e) {
    Machine.get('Weather').refresh();
  });
}
