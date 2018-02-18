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

function Item({ splitVertical, splitHorizontal, close, id }) {
  return (
    <div key={ id } style={ STYLES.item } className='splitGridScreen'>
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
  id: PropTypes.string
};

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
    const itemsToRender = items.filter(id => id);

    return (
      <div style={ Object.assign({}, STYLES.container, columnStyles) } key={ items.toString() }>
        {
          itemsToRender.map(id => {
            if (Array.isArray(id)) {
              return this._renderItems(id);
            }
            return <Item
              key={ id }
              id={ id }
              splitVertical={ () => this._split(id, items, 'vertical') }
              splitHorizontal={ () => this._split(id, items, 'horizontal') }
              close={ itemsToRender.length > 1 ? () => this._close(id) : null }/>;
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
  _close(itemId) {
    const traverse = items => {
      if (Array.isArray(items)) {
        if (items.indexOf(itemId) > -1) {
          return items.filter(id => id !== itemId)[0];
        }
        const newArr = items.map(traverse);

        newArr.type = items.type;
        return newArr;
      }
      return items;
    };

    let newItems = traverse(this.state.items);

    console.log(JSON.stringify(newItems, null, 2));
    this.setState({ items: newItems });
  }
};
