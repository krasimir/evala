import Chromath from 'chromath';

const BG_COLOR_OPACITY = 0.5;

export const COLORS_PER_TEMPERATURE = [
  { temperature: -65, color: `rgba(130, 22, 146, ${ BG_COLOR_OPACITY })` },
  { temperature: -55, color: `rgba(130, 22, 146, ${ BG_COLOR_OPACITY })` },
  { temperature: -45, color: `rgba(130, 22, 146, ${ BG_COLOR_OPACITY })` },
  { temperature: -40, color: `rgba(130, 22, 146, ${ BG_COLOR_OPACITY })` },
  { temperature: -30, color: `rgba(130, 87, 219, ${ BG_COLOR_OPACITY })` },
  { temperature: -20, color: `rgba(32, 140, 236, ${ BG_COLOR_OPACITY })` },
  { temperature: -10, color: `rgba(32, 196, 232, ${ BG_COLOR_OPACITY })` },
  { temperature: 0, color: `rgba(35, 221, 221, ${ BG_COLOR_OPACITY })` },
  { temperature: 10, color: `rgba(194, 255, 40, ${ BG_COLOR_OPACITY })` },
  { temperature: 20, color: `rgba(255, 240, 40, ${ BG_COLOR_OPACITY })` },
  { temperature: 25, color: `rgba(255, 194, 40, ${ BG_COLOR_OPACITY })` },
  { temperature: 30, color: `rgba(252, 128, 20, ${ BG_COLOR_OPACITY })` }
];
export const BG_DEFAULT_COLOR = 'rgba(255, 255, 255, 1)';
export const GOOGLE_MAPS_API_KEY = 'AIzaSyAj1B0ZHdivYN5cG8-7Ry5fnLvtuY9rm0o';

export function calculateBGColor(temperature) {
  for (let i = 0; i < COLORS_PER_TEMPERATURE.length - 1; i++) {
    if (
      temperature >= COLORS_PER_TEMPERATURE[i].temperature &&
      temperature < COLORS_PER_TEMPERATURE[i + 1].temperature
    ) {
      const from = COLORS_PER_TEMPERATURE[i].color;
      const to = COLORS_PER_TEMPERATURE[i + 1].color;
      const lower = temperature - COLORS_PER_TEMPERATURE[i].temperature;
      const higher = COLORS_PER_TEMPERATURE[i + 1].temperature - COLORS_PER_TEMPERATURE[i].temperature;
      const percentage = lower / higher;

      return Chromath.towards(from, to, percentage).toString();
    }
  }
  return COLORS_PER_TEMPERATURE[COLORS_PER_TEMPERATURE.length - 1].color;
}

const WEATHER_ICONS_MAPPING = {
  '200': {
    'label': 'thunderstorm with light rain',
    'icon': 'storm-showers'
  },

  '201': {
    'label': 'thunderstorm with rain',
    'icon': 'storm-showers'
  },

  '202': {
    'label': 'thunderstorm with heavy rain',
    'icon': 'storm-showers'
  },

  '210': {
    'label': 'light thunderstorm',
    'icon': 'storm-showers'
  },

  '211': {
    'label': 'thunderstorm',
    'icon': 'thunderstorm'
  },

  '212': {
    'label': 'heavy thunderstorm',
    'icon': 'thunderstorm'
  },

  '221': {
    'label': 'ragged thunderstorm',
    'icon': 'thunderstorm'
  },

  '230': {
    'label': 'thunderstorm with light drizzle',
    'icon': 'storm-showers'
  },

  '231': {
    'label': 'thunderstorm with drizzle',
    'icon': 'storm-showers'
  },

  '232': {
    'label': 'thunderstorm with heavy drizzle',
    'icon': 'storm-showers'
  },

  '300': {
    'label': 'light intensity drizzle',
    'icon': 'sprinkle'
  },

  '301': {
    'label': 'drizzle',
    'icon': 'sprinkle'
  },

  '302': {
    'label': 'heavy intensity drizzle',
    'icon': 'sprinkle'
  },

  '310': {
    'label': 'light intensity drizzle rain',
    'icon': 'sprinkle'
  },

  '311': {
    'label': 'drizzle rain',
    'icon': 'sprinkle'
  },

  '312': {
    'label': 'heavy intensity drizzle rain',
    'icon': 'sprinkle'
  },

  '313': {
    'label': 'shower rain and drizzle',
    'icon': 'sprinkle'
  },

  '314': {
    'label': 'heavy shower rain and drizzle',
    'icon': 'sprinkle'
  },

  '321': {
    'label': 'shower drizzle',
    'icon': 'sprinkle'
  },

  '500': {
    'label': 'light rain',
    'icon': 'rain'
  },

  '501': {
    'label': 'moderate rain',
    'icon': 'rain'
  },

  '502': {
    'label': 'heavy intensity rain',
    'icon': 'rain'
  },

  '503': {
    'label': 'very heavy rain',
    'icon': 'rain'
  },

  '504': {
    'label': 'extreme rain',
    'icon': 'rain'
  },

  '511': {
    'label': 'freezing rain',
    'icon': 'rain-mix'
  },

  '520': {
    'label': 'light intensity shower rain',
    'icon': 'showers'
  },

  '521': {
    'label': 'shower rain',
    'icon': 'showers'
  },

  '522': {
    'label': 'heavy intensity shower rain',
    'icon': 'showers'
  },

  '531': {
    'label': 'ragged shower rain',
    'icon': 'showers'
  },

  '600': {
    'label': 'light snow',
    'icon': 'snow'
  },

  '601': {
    'label': 'snow',
    'icon': 'snow'
  },

  '602': {
    'label': 'heavy snow',
    'icon': 'snow'
  },

  '611': {
    'label': 'sleet',
    'icon': 'sleet'
  },

  '612': {
    'label': 'shower sleet',
    'icon': 'sleet'
  },

  '615': {
    'label': 'light rain and snow',
    'icon': 'rain-mix'
  },

  '616': {
    'label': 'rain and snow',
    'icon': 'rain-mix'
  },

  '620': {
    'label': 'light shower snow',
    'icon': 'rain-mix'
  },

  '621': {
    'label': 'shower snow',
    'icon': 'rain-mix'
  },

  '622': {
    'label': 'heavy shower snow',
    'icon': 'rain-mix'
  },

  '701': {
    'label': 'mist',
    'icon': 'sprinkle'
  },

  '711': {
    'label': 'smoke',
    'icon': 'smoke'
  },

  '721': {
    'label': 'haze',
    'icon': 'day-haze'
  },

  '731': {
    'label': 'sand, dust whirls',
    'icon': 'cloudy-gusts'
  },

  '741': {
    'label': 'fog',
    'icon': 'fog'
  },

  '751': {
    'label': 'sand',
    'icon': 'cloudy-gusts'
  },

  '761': {
    'label': 'dust',
    'icon': 'dust'
  },

  '762': {
    'label': 'volcanic ash',
    'icon': 'smog'
  },

  '771': {
    'label': 'squalls',
    'icon': 'day-windy'
  },

  '781': {
    'label': 'tornado',
    'icon': 'tornado'
  },

  '800': {
    'label': 'clear sky',
    'icon': 'sunny'
  },

  '801': {
    'label': 'few clouds',
    'icon': 'cloudy'
  },

  '802': {
    'label': 'scattered clouds',
    'icon': 'cloudy'
  },

  '803': {
    'label': 'broken clouds',
    'icon': 'cloudy'
  },

  '804': {
    'label': 'overcast clouds',
    'icon': 'cloudy'
  },


  '900': {
    'label': 'tornado',
    'icon': 'tornado'
  },

  '901': {
    'label': 'tropical storm',
    'icon': 'hurricane'
  },

  '902': {
    'label': 'hurricane',
    'icon': 'hurricane'
  },

  '903': {
    'label': 'cold',
    'icon': 'snowflake-cold'
  },

  '904': {
    'label': 'hot',
    'icon': 'hot'
  },

  '905': {
    'label': 'windy',
    'icon': 'windy'
  },

  '906': {
    'label': 'hail',
    'icon': 'hail'
  },

  '951': {
    'label': 'calm',
    'icon': 'sunny'
  },

  '952': {
    'label': 'light breeze',
    'icon': 'cloudy-gusts'
  },

  '953': {
    'label': 'gentle breeze',
    'icon': 'cloudy-gusts'
  },

  '954': {
    'label': 'moderate breeze',
    'icon': 'cloudy-gusts'
  },

  '955': {
    'label': 'fresh breeze',
    'icon': 'cloudy-gusts'
  },

  '956': {
    'label': 'strong breeze',
    'icon': 'cloudy-gusts'
  },

  '957': {
    'label': 'high wind, near gale',
    'icon': 'cloudy-gusts'
  },

  '958': {
    'label': 'gale',
    'icon': 'cloudy-gusts'
  },

  '959': {
    'label': 'severe gale',
    'icon': 'cloudy-gusts'
  },

  '960': {
    'label': 'storm',
    'icon': 'thunderstorm'
  },

  '961': {
    'label': 'violent storm',
    'icon': 'thunderstorm'
  },

  '962': {
    'label': 'hurricane',
    'icon': 'cloudy-gusts'
  }
};

// https://erikflowers.github.io/weather-icons/
export const getIconClassName = icon => {
  const map = [
    ['t01d', 't01n', 200],
    ['t02d', 't02n', 201],
    ['t03d', 't03n', 202],
    ['t04d', 't04n', 230],
    ['t04d', 't04n', 231],
    ['t04d', 't04n', 232],
    ['t05d', 't05n', 233],
    ['d01d', 'd01n', 300],
    ['d02d', 'd02n', 301],
    ['d03d', 'd03n', 302],
    ['r01d', 'r01n', 500],
    ['r02d', 'r02n', 501],
    ['r03d', 'r03n', 502],
    ['f01d', 'f01n', 511],
    ['r04d', 'r04n', 520],
    ['r05d', 'r05n', 521],
    ['r06d', 'r06n', 522],
    ['s01d', 's01n', 600],
    ['s02d', 's02n', 601],
    ['s03d', 's03n', 602],
    ['s04d', 's04n', 610],
    ['s05d', 's05n', 611],
    ['s05d', 's05n', 612],
    ['s01d', 's01n', 621],
    ['s02d', 's02n', 622],
    ['s06d', 's06n', 623],
    ['a01d', 'a01n', 700],
    ['a02d', 'a02n', 711],
    ['a03d', 'a03n', 721],
    ['a04d', 'a04n', 731],
    ['a05d', 'a05n', 741],
    ['a06d', 'a06n', 751],
    ['c01d', 'c01n', 800],
    ['c02d', 'c02n', 801],
    ['c02d', 'c02n', 802],
    ['c03d', 'c03n', 803],
    ['c04d', 'c04n', 804],
    ['u00d', 'u00n', 900]
  ];
  const code = map.find(item => item[0] === icon || item[1] === icon);

  if (code) {
    if (WEATHER_ICONS_MAPPING[code[2].toString()]) {
      return WEATHER_ICONS_MAPPING[code[2].toString()].icon;
    }
  }
  return false;
};
