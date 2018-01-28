import { Machine } from 'stent';
import moment from 'moment';
import { call } from 'stent/lib/helpers';
import extractTags from '../helpers/extractTags';
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
        const { tags, text } = this.searchCriteria(str);

        if (tags.length === 0 && text.length === 0) return { ...state, filtered: [] };

        const dbResult = yield call(() => db.notes
          .filter(note => {
            if (note.tags.length === 0 && tags.indexOf(NO_TAG) >= 0) return true;
            if (note.tags.length > 0 && intersection(note.tags, tags).length === tags.length) {
              return true;
            }
            return false;
          })
          .and(note => {
            if (text.length === 0) return true;
            return text.some(t => note.content.match(new RegExp(t, 'i')));
          })
        );
        const filtered = yield call(dbResult.toArray.bind(dbResult));

        return { ...state, filtered };
      },
      'edit': function * (state, id, content) {
        yield call(db.notes.update.bind(db.notes), id, {
          content,
          tags: extractTags(content) || [],
          edited: moment().toString()
        });
        this.fetch();
      },
      delete: function (state, id) {
        // TODO
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

// for (let i = 0; i < 100; i++) {
//   if (i % 20 === 0) {
//     Notes.create('TODO ' + i + ' Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,\n\nwhen an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\nIt has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n\nIt was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
//   } else {
//     Notes.create('TODO ' + i + ' one liner #todo');
//   }
// }

export default Notes;
