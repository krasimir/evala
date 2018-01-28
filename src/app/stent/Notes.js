import { Machine } from 'stent';
import moment from 'moment';
import { call } from 'stent/lib/helpers';
import extractTags from '../helpers/extractTags';
import remove from 'lodash.remove';
import intersection from 'lodash.intersection';
import db from '../db';
import { NO_TAG } from '../constants';

const Notes = Machine.create('Notes', {
  state: { name: 'idle', notesByTag: {}, filtered: [] },
  transitions: {
    'idle': {
      'create': function (state, content) {
        db.notes.add({
          content,
          tags: extractTags(content) || [],
          created: moment().toString(),
          edited: moment().toString(),
          done: false
        });
        this.fetch();
      },
      'fetch': function * (state) {
        const notesByTag = {};

        yield call(db.notes.each.bind(db.notes), ({ tags }) => {
          if (tags) {
            if (tags.length > 0) {
              tags.forEach(tag => {
                if (!notesByTag[tag]) notesByTag[tag] = 0;
                notesByTag[tag] += 1;
              });
            } else {
              if (!notesByTag[NO_TAG]) notesByTag[NO_TAG] = 0;
              notesByTag[NO_TAG] += 1;
            }
          }
        });

        return { ...state, notesByTag };
      },
      'search': function * (state, str) {
        const criteria = this.searchCriteria(str);

        const dbResult = yield call(db.notes.filter.bind(db.notes), note => {
          if (note.tags.length === 0 && criteria.tags.indexOf(NO_TAG) >= 0) return true;
          if (note.tags.length > 0 && intersection(note.tags, criteria.tags).length === criteria.tags.length) {
            return true;
          }
          return false;
        });
        const filtered = yield call(dbResult.toArray.bind(dbResult));

        return { ...state, filtered };
      },
      'edit': function (state, noteId, data) {
        const found = state.notes.find(({ id }) => id === noteId);

        if (found) {
          Object.keys(data).forEach(prop => {
            found[prop] = data[prop];
            if (prop === 'content') {
              found.tags = extractTags(data[prop]) || [];
            }
          });
        }
        return state;
      },
      delete: function (state, noteId) {
        remove(state.notes, ({ id }) => id === noteId);
        this.sort();
        return state;
      }
    }
  },
  sort: function () {
    if (this.state.notes && this.state.notes.length > 0) {
      this.state.notes.sort((b, a) => ((new Date(a.edited)) - (new Date(b.edited))));
    }
  },
  searchCriteria: function (text = '') {
    return text.split(/ /gi).reduce((result, token) => {
      const tags = extractTags(token);

      if (tags && tags.length > 0) {
        result.tags = result.tags.concat(tags);
      } else if (token !== '' && token !== ' ' && token.length >= 2) {
        result.text.push(token);
      }

      return result;
    }, { tags: [], text: [] });
  }
});

Notes.fetch();

// for (let i = 0; i < 1000; i++) {
//   if (i % 20 === 0) {
//     Notes.create('TODO ' + i + ' Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,\n\nwhen an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\nIt has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n\nIt was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
//   } else {
//     Notes.create('TODO ' + i + ' one liner #todo');
//   }
// }

export default Notes;
