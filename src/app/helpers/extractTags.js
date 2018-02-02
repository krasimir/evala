import uniq from 'lodash.uniq';

const REGEXP = /#[\wа-я\.\-_\!\?%$^&*\(\)@\+:]+/gi;

const formatDate = str => {
  try {
    return Date.parse(str);
  } catch (error) {
    return NaN;
  }
};

export default function extractTags(str) {
  const tags = str.match(REGEXP);
  var result = { tags: [], dates: [] };

  if (tags && tags.length > 0) {
    result = uniq(tags).reduce((r, tag) => {
      const dates = tag.split('_').map(formatDate);

      if (dates.length > 1 && dates.every(d => !isNaN(d))) {
        r.dates.push({ from: dates[0], to: dates[1] });
      } else if (!isNaN(dates[0])) {
        r.dates.push(dates[0]);
      } else {
        r.tags.push(tag);
      }

      return r;
    }, result);
  }
  return result;
};
