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
      },
      'open': function (state, content) {
        if (!content) {
          return { name: 'closed', content };
        }
        return { name: 'opened', content };
      }
    }
  }
});

export default Details;
