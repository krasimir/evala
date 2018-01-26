import { Machine } from 'stent';

function open(state, content) {
  return { name: 'opened', content };
}
function close() {
  return { name: 'closed', content: null };
}

const Sidebar = Machine.create('Sidebar', {
  state: { name: 'closed', content: null },
  transitions: {
    'closed': {
      'open': open
    },
    'opened': {
      'close': close,
      'open': open
    }
  }
});

export default Sidebar;
