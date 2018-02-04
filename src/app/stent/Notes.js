import { Machine } from 'stent';
import moment from 'moment';
import { call } from 'stent/lib/helpers';
import extractTags from '../helpers/extractTags';
import intersection from 'lodash.intersection';
import db from '../services/db';
import { NO_TAG } from '../constants';
import { IS_INDEXDB_SUPPORTED } from '../helpers/capabilities';

const Notes = Machine.create('Notes', {
  state: { name: 'idle', notesByTag: {}, filtered: [], filteredByDate: [] },
  transitions: {
    'idle': {
      'create': function (state, content) {
        const { tags, dates } = extractTags(content);

        db.notes.add({
          content,
          tags,
          created: moment().toString(),
          edited: moment().toString(),
          done: false,
          dates
        });
        this.fetch();
      },
      'fetch': function * (state) {
        if (!IS_INDEXDB_SUPPORTED) {
          return state;
        }

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

        return { ...state, filtered: this.sort(filtered) };
      },
      'search by date range': function * (state, from, to) {
        const dbResult = yield call(() => db.notes
          .filter(note => {
            if (note.dates && note.dates.length > 0) {
              return true;
            }
            return false;
          })
        );
        const filteredByDate = yield call(dbResult.toArray.bind(dbResult));

        return { ...state, filteredByDate: this.sort(filteredByDate) };
      },
      'edit': function * (state, id, content) {
        const { tags, dates } = extractTags(content);

        yield call(db.notes.update.bind(db.notes), id, {
          content,
          tags,
          edited: moment().toString(),
          dates
        });
        this.fetch();
      },
      'change status': function * (state, id, done) {
        yield call(db.notes.update.bind(db.notes), id, {
          done,
          edited: moment().toString()
        });
      },
      delete: function * (state, id) {
        yield call(db.notes.delete.bind(db.notes), id);
        this.fetch();
      }
    }
  },
  sort: function (notes) {
    if (notes && notes.length > 0) {
      notes.sort((b, a) => ((new Date(a.edited)) - (new Date(b.edited))));
    }
    return notes;
  },
  searchCriteria: function (text = '') {
    return text.split(/ /gi).reduce((result, token) => {
      const { tags } = extractTags(token);

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

export default Notes;
