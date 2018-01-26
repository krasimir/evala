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
  this.edited = moment().toString();
  this.id = hashCode(this.created);
  this.done = false;
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
      'create': function (state, content) {
        state.notes.push(new Note(content));
        storeData(state.notes);
        return state;
      },
      'fetch': function * () {
        const notes = yield call(fetchData);

        notes.sort((b, a) => ((new Date(a.edited)) - (new Date(b.created))));

        return { name: 'idle', notes: notes ? notes : [] };
      },
      'edit': function (state, noteId, data) {
        const found = state.notes.find(({ id }) => id === noteId);

        if (found) {
          Object.keys(data).forEach(prop => {
            found[prop] = data[prop];
            if (prop === 'content') {
              found.tags = extractTags(data[prop]);
            }
          });
        }
        storeData(state.notes);
        return state;
      }
    }
  }
});

Notes.fetch();

export default Notes;
