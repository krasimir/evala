import { BG_COLORS } from '../constants';

export default function getGlobalStyles() {
  return `
    body {
      background: ${ BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)] };
      transition: background-color 1000ms ease;
    }
  `;
};
