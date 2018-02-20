import React from 'react';
import PropTypes from 'prop-types';

var ID = 1;
const getId = () => 'item' + (ID++);

const STYLES = {
  container: {
    width: '100%',
    height: '100%',
    display: 'grid',
    color: '#fff',
    gridGap: '0.5em'
  }
};
const CONTENT = {};

function getSplitClassName(index, type) {
  if (index === 0 && type === 'vertical') {
    return ' verticalSplit';
  } else if (index === 0 && type === 'horizontal') {
    return ' horizontalSplit';
  }
  return '';
}

function Item({ close, id, content, index, type, siblings, split }) {
  const splitVertical = () => split(id, siblings, 'vertical');
  const splitHorizontal = () => split(id, siblings, 'horizontal');

  if (!CONTENT[id]) {
    CONTENT[id] = content({ splitVertical, splitHorizontal, close });
  }

  return (
    <div key={ id } className={ 'splitGridScreen' + getSplitClassName(index, type) }>
      { CONTENT[id] }
    </div>
  );
}

Item.propTypes = {
  close: PropTypes.func,
  content: PropTypes.func,
  id: PropTypes.string,
  type: PropTypes.string,
  index: PropTypes.number,
  siblings: PropTypes.array,
  split: PropTypes.func
};

export default class SplitGrid extends React.Component {
  constructor(props) {
    super(props);

    this._split = this._split.bind(this);
    this.state = {
      items: [ [ getId() ] ]
    };
  }
  render() {
    return this._renderItems(this.state.items);
  }
  _renderItems(items, level = 0, parentType) {
    const columnStyles = {
      [items.type === 'horizontal' ? 'gridTemplateRows' : 'gridTemplateColumns']:
      items.map(i => '1fr').join(' ')
    };
    const itemsToRender = items.filter(id => id);

    return (
      <div className={ getSplitClassName(0, parentType) }
        style={ Object.assign({}, STYLES.container, columnStyles) } key={ level }>
        {
          itemsToRender.map((id, i) => {
            if (Array.isArray(id)) {
              return this._renderItems(id, level + 1 + i, items.type);
            }
            return <Item
              key={ id }
              id={ id }
              siblings={ items }
              index={ i }
              type={ items.type }
              split={ this._split }
              close={ itemsToRender.length > 1 ? () => this._close(id) : null }
              content={ this.props.content }
            />;
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
    this.setState({ items: this.state.items });
  }
  _close(itemId) {
    const traverse = items => {
      if (Array.isArray(items)) {
        if (items.indexOf(itemId) > -1) {
          delete CONTENT[itemId];
          return items.filter(id => id !== itemId)[0];
        }
        const newArr = items.map(traverse);

        newArr.type = items.type;
        return newArr;
      }
      return items;
    };

    let newItems = traverse(this.state.items);

    this.setState({ items: newItems });
  }
};

SplitGrid.propTypes = {
  content: PropTypes.func
};
