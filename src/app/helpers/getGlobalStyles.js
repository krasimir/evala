import { BG_DEFAULT_COLOR, calculateBGColor } from '../constants';
// http://home.localhost/Krasimir/gid/node_modules/chromath/docs/files/chromath-js.html
import Chromath from 'chromath';
import moment from 'moment';

function getTimeBGColor(bgColor) {
  const partOfTheDay = moment().hour() / 24;

  return Chromath.darken(bgColor, partOfTheDay).toRGBString();
}

export default function getGlobalStyles(today) {
  var bgColor = BG_DEFAULT_COLOR;

  if (today) {
    bgColor = calculateBGColor(today.temperature);
  }

  return `
    body {
      background: linear-gradient(170deg, ${ bgColor } 0%, ${ Chromath.darken(bgColor, 0.1).toRGBString() } 50%, ${ getTimeBGColor(bgColor) } 50%);
      transition: background 1000ms ease;
    }
  `;
};
