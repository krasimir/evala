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
  }
};
const CONTENT = {};

function Item({ splitVertical, splitHorizontal, close, id, content }) {
  if (!CONTENT[id]) {
    console.log('create new one ' + id);
    CONTENT[id] = content();
  }

  return (
    <div key={ id } style={ STYLES.item } className='splitGridScreen'>
      { CONTENT[id] }
      <nav>
        <a onClick={ splitVertical } className='splitGridItem' style={{ transform: 'rotateZ(90deg)' }}>
          <i className='fa fa-minus-square-o'></i>
        </a>
        <a onClick={ splitHorizontal } className='splitGridItem' style={{ transform: 'translateY(1px)' }}>
          <i className='fa fa-minus-square-o'></i>
        </a>
        { close && <a onClick={ close } className='splitGridItem'>
          <i className='fa fa-times'></i>
        </a> }
      </nav>
    </div>
  );
}

Item.propTypes = {
  splitVertical: PropTypes.func.isRequired,
  splitHorizontal: PropTypes.func.isRequired,
  close: PropTypes.func,
  content: PropTypes.func,
  id: PropTypes.string
};

export default class SplitGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [ [ getId() ] ]
    };
  }
  render() {
    return this._renderItems(this.state.items);
  }
  _renderItems(items, level = 0) {
    const columnStyles = {
      [items.type === 'horizontal' ? 'gridTemplateRows' : 'gridTemplateColumns']:
      items.map(i => '1fr').join(' ')
    };
    const itemsToRender = items.filter(id => id);

    return (
      <div style={ Object.assign({}, STYLES.container, columnStyles) } key={ level }>
        {
          itemsToRender.map(id => {
            if (Array.isArray(id)) {
              return this._renderItems(id, level + 1);
            }
            return <Item
              key={ id }
              id={ id }
              splitVertical={ () => this._split(id, items, 'vertical') }
              splitHorizontal={ () => this._split(id, items, 'horizontal') }
              close={ itemsToRender.length > 1 ? () => this._close(id) : null }
              content={ this.props.content } />;
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
