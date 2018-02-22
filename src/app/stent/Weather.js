import { Machine } from 'stent';
import { call } from 'stent/lib/helpers';
import { GOOGLE_MAPS_API_KEY } from '../constants';
import normalizeWeatherData from '../helpers/normalizeWeatherData';
import moment from 'moment';
import { IS_LOCALSTORAGE_SUPPORTED } from '../helpers/capabilities';

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
    return './mocks/weather.json';
  }
  return `http://evala.krasimirtsonev.com?lat=${ lat }&lon=${ lng }`;
}
function getJSONData(fetchResponse) {
  return fetchResponse.json();
}
function * fetchLocal(refresh) {
  const fromLocalStorage = localStorage.getItem('EVALA_WEATHER');

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

  if (!IS_LOCALSTORAGE_SUPPORTED) {
    return state;
  }

  yield 'fetching';

  const { local, diff } = yield call(fetchLocal, refresh);

  if (local) {
    data = normalizeWeatherData(local.data);
    lastUpdated = moment(local.lastUpdated);
    yield { name: 'with-data', data, lastUpdated: local.lastUpdated };
  }

  if (!local || diff > REFRESH_AFTER) {
    try {
      const apiData = yield * fetchRemote();

      data = normalizeWeatherData(apiData);
      lastUpdated = moment();
      localStorage.setItem('EVALA_WEATHER', JSON.stringify({ data: apiData, lastUpdated }));
    } catch (error) {
      console.error(error);
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

