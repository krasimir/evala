import { BG_DEFAULT_COLOR, calculateBGColor } from '../constants';

export default function getGlobalStyles(today) {
  var bgColor = BG_DEFAULT_COLOR;

  if (today) {
    bgColor = calculateBGColor(today.temperature);
  }

  return `
    body {
      background: ${ bgColor };
      transition: background-color 1000ms ease;
    }
  `;
};
