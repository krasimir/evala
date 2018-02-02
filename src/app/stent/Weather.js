import { Machine } from 'stent';
import { call } from 'stent/lib/helpers';
import { GOOGLE_MAPS_API_KEY } from '../constants';
import normalizeDarkSkyData from '../helpers/normalizeDarkSkyData';
import moment from 'moment';

const USE_FAKE = false;
const REFRESH_AFTER = 4; // hours

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
function * fetchLocal(refresh) {
  const fromLocalStorage = localStorage.getItem('GID_WEATHER');

  if (fromLocalStorage) {
    try {
      const { data, lastUpdated } = JSON.parse(fromLocalStorage);

      return {
        local: {
          data,
          lastUpdated
        },
        diff: refresh ? REFRESH_AFTER + 1 : (moment().diff(moment(lastUpdated), 'hours', true))
      };
    } catch (error) {
      console.log('Error parsing weather data from local storage', error);
    }
  }
  return {};
}
function * fetchRemote() {
  const gmResponse = yield call(fetch, createGoogleMapsURL(), { method: 'POST' });
  const { location } = yield call(getJSONData, gmResponse);
  const weatherResponse = yield call(fetch, createWeatherURL(location), { method: 'GET', mode: 'cors' });

  return yield call(getJSONData, weatherResponse);
}

function * fetchData(state, refresh = false) {
  var data = null, lastUpdated = null;

  yield 'fetching';

  const { local, diff } = yield call(fetchLocal, refresh);

  if (local) {
    data = normalizeDarkSkyData(local.data);
    lastUpdated = moment(local.lastUpdated);
  }

  if (!local || diff > REFRESH_AFTER) {
    try {
      const apiData = yield * fetchRemote();

      data = normalizeDarkSkyData(apiData);
      lastUpdated = moment();
      localStorage.setItem('GID_WEATHER', JSON.stringify({ data: apiData, lastUpdated }));
    } catch (error) {
      if (!local) {
        return { name: 'error', data: null, error };
      }
      return { name: 'with-data', data, lastUpdated };
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
        return yield call(fetchData, true);
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

