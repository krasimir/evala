export default function extractTags(str) {
  return str.match(/#[\wа-я]+/gi);
};
