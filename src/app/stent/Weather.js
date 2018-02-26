import { Machine } from 'stent';
import { call } from 'stent/lib/helpers';
import { GOOGLE_MAPS_API_KEY } from '../constants';
import normalizeWeatherData from '../helpers/normalizeWeatherData';
import moment from 'moment';
import { IS_LOCALSTORAGE_SUPPORTED } from '../helpers/capabilities';

const USE_FAKE = false;
const REFRESH_AFTER = 4; // hours
const WEATHER_KEY = 'EVALA_WEATHER';
const GEO_KEY = 'EVALA_GEO';

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
function * fetchLocal() {
  const fromLocalStorage = localStorage.getItem(WEATHER_KEY);

  if (fromLocalStorage) {
    try {
      const { data, lastUpdated } = JSON.parse(fromLocalStorage);

      return {
        local: {
          data,
          lastUpdated
        },
        diff: moment().diff(moment(lastUpdated), 'hours', true)
      };
    } catch (error) {
      console.log('Error parsing weather data from local storage', error);
    }
  }
  return {};
}
function * fetchRemote() {
  const geoLocal = localStorage.getItem(GEO_KEY);
  var geoData;

  if (geoLocal) {
    geoData = JSON.parse(geoLocal);
  } else {
    const geoResponse = yield call(fetch, createGoogleMapsURL(), { method: 'POST' });
    const { location } = yield call(getJSONData, geoResponse);

    geoData = location;
    localStorage.setItem(GEO_KEY, JSON.stringify(geoData));
  }

  const weatherResponse = yield call(fetch, createWeatherURL(geoData), { method: 'GET', mode: 'cors' });

  return yield call(getJSONData, weatherResponse);
}

function * fetchData(state) {
  var data = null, lastUpdated = null;

  if (!IS_LOCALSTORAGE_SUPPORTED) {
    return state;
  }

  yield 'fetching';

  const { local, diff } = yield call(fetchLocal);

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
      localStorage.setItem(WEATHER_KEY, JSON.stringify({ data: apiData, lastUpdated }));
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
        localStorage.removeItem(GEO_KEY);
        localStorage.removeItem(WEATHER_KEY);
        return yield call(fetchData, true);
      },
      'save geo': function * (state, geoData) {
        localStorage.setItem(GEO_KEY, JSON.stringify(geoData));
        localStorage.removeItem(WEATHER_KEY);
        return yield call(fetchData, true);
      }
    }
  },
  today() {
    if (this.state.data) {
      return this.state.data.days.find(day => day.time.isSame(moment(), 'day'));
    }
    return null;
  },
  geo() {
    const geoLocal = localStorage.getItem(GEO_KEY);

    if (geoLocal) {
      return JSON.parse(geoLocal);
    }
    return { lat: '', lng: '' };
  }
});

export default Weather;

