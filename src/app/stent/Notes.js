import { Machine } from 'stent';
import moment from 'moment';
import localforage from 'localforage';
import { call } from 'stent/lib/helpers';
import extractTags from '../helpers/extractTags';

const NOTES_KEY = '__notes';

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
}
function Note(content) {
  this.content = content;
  this.tags = extractTags(content);
  this.created = moment().toString();
  this.id = hashCode(this.created);
}

function storeData(notes) {
  try {
    localforage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.log('Can not store the notes in the local db!', error);
  }
}
function fetchData() {
  try {
    return localforage.getItem(NOTES_KEY).then(data => JSON.parse(data));
  } catch (error) {
    console.log('Can not get the notes from the local db!', error);
    return [];
  }
}

const Notes = Machine.create('Notes', {
  state: { name: 'idle', notes: [] },
  transitions: {
    'idle': {
      'create note': function (state, content) {
        state.notes.push(new Note(content));
        storeData(state.notes);
        return state;
      },
      'fetch': function * () {
        const notes = yield call(fetchData);

        return { name: 'idle', notes: notes ? notes : [] };
      }
    }
  }
});

Notes.fetch();

export default Notes;
