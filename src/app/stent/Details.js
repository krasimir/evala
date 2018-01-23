import { Machine } from 'stent';

const Details = Machine.create('Details', {
  state: { name: 'closed', content: null },
  transitions: {
    'closed': {
      'open': function (state, content) {
        return { name: 'opened', content };
      }
    },
    'opened': {
      'close': function (state, content) {
        return { name: 'closed', content: null };
      }
    }
  }
});

export default Details;
