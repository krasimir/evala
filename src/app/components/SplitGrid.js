import React from 'react';
import PropTypes from 'prop-types';

var ID = 1;
const getId = () => 'item' + (ID++);

const STYLES = {
  container: {
    width: '100%',
    height: '100%',
    display: 'grid',
    color: '#fff'
  },
  item: {
    border: 'solid 1px #999'
  }
};

function Item({ splitVertical, splitHorizontal, id }) {
  return (
    <div key={ id } style={ STYLES.item }>
      <a onClick={ splitVertical }>split vertical</a><br />
      <a onClick={ splitHorizontal }>split horizontal</a>
    </div>
  );
}

export default class SplitGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [ getId() ]
    };
  }
  render() {
    return this._renderItems(this.state.items);
  }
  _renderItems(items) {
    const columnStyles = {
      [items.type === 'horizontal' ? 'gridTemplateRows' : 'gridTemplateColumns']:
      items.map(i => '1fr').join(' ')
    };

    return (
      <div style={ Object.assign({}, STYLES.container, columnStyles) } key={ items.toString() }>
        {
          items.map(id => {
            if (Array.isArray(id)) {
              return this._renderItems(id);
            }
            return <Item
              key={ id }
              id={ id }
              splitVertical={ () => this._split(id, items, 'vertical') }
              splitHorizontal={ () => this._split(id, items, 'horizontal') }/>;
          })
        }
      </div>
    );
  }
  _split(itemId, items, type) {
    items.forEach((id, i) => {
      if (id === itemId) {
        items[i] = [ id, getId() ];
        items[i].type = type;
      }
    });
    console.log(JSON.stringify(this.state.items, null, 2));
    this.setState({ items: this.state.items });
  }
};
