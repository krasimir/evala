var ls = null, idb = null;

(function () {
  var test = 'test';

  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    ls = localStorage;
  } catch (e) {
    ls = false;
  }
})();

idb = window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;

export const IS_LOCALSTORAGE_SUPPORTED = !!ls;
export const IS_INDEXDB_SUPPORTED = !!idb;
