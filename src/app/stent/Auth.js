import { Machine } from 'stent';

export const NOT_AUTHORIZED = 'not authorized';

const Auth = Machine.create('Auth', {
  state: {
    name: NOT_AUTHORIZED,
    user: null
  },
  transitions: {
    [ NOT_AUTHORIZED ]: {
      'authorize': function () {

      }
    }
  }
});

export default Auth;
