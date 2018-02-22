/* eslint-disable camelcase */
import moment from 'moment';

const toDateTime = time => moment(time);

export default function normalizeWeatherData(data) {
  // console.log(data);

  const days = data.data.map(({
    datetime,
    weather,
    icon,
    max_temp,
    min_temp,
    temp
  }) => ({
    time: toDateTime(datetime),
    summary: weather.description,
    icon: weather.icon,
    max: Math.floor(max_temp),
    min: Math.floor(min_temp),
    temperature: Math.floor(temp)
  }));

  return { days, timezone: data.timezone, city: data.city_name, country: data.country_code };
};
