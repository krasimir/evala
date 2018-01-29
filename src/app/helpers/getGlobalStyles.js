/* eslint-disable max-len */
import { BG_DEFAULT_COLOR, calculateBGColor } from '../constants';
// http://home.localhost/Krasimir/gid/node_modules/chromath/docs/files/chromath-js.html
import Chromath from 'chromath';
import moment from 'moment';

function getTimeBGColor(bgColor) {
  const partOfTheDay = moment().hour() / 24;
  // const partOfTheDay = 0.8;

  return Chromath.darken(bgColor, partOfTheDay).toRGBString();
}

export default function getGlobalStyles(today) {
  var bgColor = BG_DEFAULT_COLOR;
  var temperature;

  if (today) {
    temperature = today.temperature;
    bgColor = calculateBGColor(temperature);
  }

  return `
    body {
      background: linear-gradient(
        174deg,
        ${ Chromath.tint(bgColor, 0.4).toRGBString() } 0%,
        ${ getTimeBGColor(bgColor) } 100%
      );
    }
  `;
};
