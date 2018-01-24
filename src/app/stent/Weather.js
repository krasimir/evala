import { Machine } from 'stent';
import { call } from 'stent/lib/helpers';
import { GOOGLE_MAPS_API_KEY } from '../constants';
import normalizeDarkSkyData from '../helpers/normalizeDarkSkyData';
import moment from 'moment';

const USE_FAKE = false;

function createGoogleMapsURL() {
  if (USE_FAKE) {
    return './mocks/googlemaps.json';
  }
  return `https://www.googleapis.com/geolocation/v1/geolocate?key=${ GOOGLE_MAPS_API_KEY }`;
}
function createWeatherURL({ lat, lng }) {
  if (USE_FAKE) {
    return './mocks/darksky.json';
  }
  return `http://gid.krasimirtsonev.com/weather/?lat=${ lat }&lng=${ lng }`;
}
function getJSONData(fetchResponse) {
  return fetchResponse.json();
}
function * fetchLocal() {
  const fromLocalStorage = localStorage.getItem('GID_WEATHER');

  if (fromLocalStorage) {
    try {
      const { data, lastUpdated } = JSON.parse(fromLocalStorage);
      const diffInHours = (moment().diff(moment(lastUpdated), 'hours', true));

      if (diffInHours <= 4) {
        return { data, lastUpdated };
      }
    } catch (error) {
      console.log('Error parsing weather data from local storage', error);
    }
  }
  return false;
}
function * fetchRemote() {

  const { location } = yield call(getJSONData,
    yield call(fetch, createGoogleMapsURL(), { method: 'POST' })
  );
  const data = yield call(getJSONData,
    yield call(fetch, createWeatherURL(location), { method: 'GET', mode: 'cors' })
  );

  return data;
}

function * fetchData(state) {
  var data = null, lastUpdated = null;

  yield 'fetching';

  const local = yield call(fetchLocal);

  if (local) {
    data = normalizeDarkSkyData(local.data);
    lastUpdated = moment(local.lastUpdated);
  } else {
    try {
      const apiData = yield call(fetchRemote);

      data = normalizeDarkSkyData(apiData);
      lastUpdated = moment();
      localStorage.setItem('GID_WEATHER', JSON.stringify({ data: apiData, lastUpdated }));
    } catch (error) {
      return { name: 'error', data: null, error };
    }
  }

  return { name: 'with-data', data, lastUpdated };
}

const Weather = Machine.create('Weather', {
  state: { name: 'no-data', data: null },
  transitions: {
    'no-data': {
      'fetch': fetchData
    },
    'fetching': {
      'foo': 'bar'
    },
    'error': {
      'fetch': fetchData
    },
    'with-data': {
      'fetch': fetchData,
      'refresh': function * (state) {
        localStorage.removeItem('GID_WEATHER');
        return yield call(fetchData);
      }
    }
  },
  today() {
    if (this.state.data) {
      return this.state.data.days.find(day => day.time.isSame(moment(), 'day'));
    }
    return null;
  }
});

export default Weather;

