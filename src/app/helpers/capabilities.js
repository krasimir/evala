var ls = null;

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

export const IS_LOCALSTORAGE_SUPPORTED = !!ls;
