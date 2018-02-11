/* eslint-disable max-len */
import { BG_DEFAULT_COLOR, calculateBGColor } from '../constants';
// http://home.localhost/Krasimir/gid/node_modules/chromath/docs/files/chromath-js.html
import Chromath from 'chromath';

export default function getGlobalStyles(today) {
  var bgColor = BG_DEFAULT_COLOR;
  var temperature;

  if (today) {
    temperature = today.temperature;
    bgColor = calculateBGColor(temperature);
  }
  return `
    body {
      background: ${ Chromath.tint(bgColor, 0.4).toRGBString() };
    }
  `;
};
