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
export const NO_TAG = '#notag';

export function calculateBGColor(temperature) {
  for (let i = 0; i < COLORS_PER_TEMPERATURE.length - 1; i++) {
    if (
      temperature >= COLORS_PER_TEMPERATURE[i].temperature &&
      temperature < COLORS_PER_TEMPERATURE[i + 1].temperature
    ) {
      return COLORS_PER_TEMPERATURE[i].color;
    }
  }
  return COLORS_PER_TEMPERATURE[COLORS_PER_TEMPERATURE.length - 1].color;
}
