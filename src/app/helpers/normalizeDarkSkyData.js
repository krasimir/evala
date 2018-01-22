import moment from 'moment';

const toDateTime = time => moment.unix(time);

export default function normalizeDarkSkyData(data) {
  // console.log(data);

  const days = data.daily.data.map(({
    time,
    summary,
    icon,
    apparentTemperatureMax,
    apparentTemperatureMin,
    temperatureMax,
    temperatureMin
  }) => ({
    time: toDateTime(time),
    summary: summary,
    icon: icon,
    max: Math.floor(temperatureMax),
    min: Math.floor(temperatureMin),
    temperature: Math.floor((temperatureMax + temperatureMin) / 2),
    apparentTemperature: Math.floor((apparentTemperatureMax + apparentTemperatureMin) / 2)
  }));
  const hours = data.hourly.data.map(({
    time,
    temperature,
    apparentTemperature,
    icon,
    summary
  }) => ({
    time: toDateTime(time),
    temperature: Math.floor(temperature),
    apparentTemperature: Math.floor(apparentTemperature),
    icon,
    summary
  }));

  return { days, hours, timezone: data.timezone };
};
