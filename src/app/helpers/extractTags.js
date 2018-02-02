import uniq from 'lodash.uniq';
import moment from 'moment';

const REGEXP = /#[\wа-я\.\-_\!\?%$^&*\(\)@\+]+/gi;

export default function extractTags(str) {
  const tags = str.match(REGEXP);
  var result = { tags: [], dates: [] };

  if (tags && tags.length > 0) {
    result = uniq(tags).reduce((r, tag) => {
      var date;

      try {
        date = moment(tag.substr(1));
      } catch (error) {

      }

      if (date.isValid()) {
        r.dates.push(date);
      } else {
        r.tags.push(tag);
      }
      return r;
    }, result);
  }
  return result;
};
