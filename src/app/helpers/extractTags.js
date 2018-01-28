import uniq from 'lodash.uniq';

export default function extractTags(str) {
  const tags = str.match(/#[\wа-я]+/gi);

  if (tags && tags.length > 0) {
    return uniq(tags);
  }
  return tags;
};
