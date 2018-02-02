import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import moment from 'moment';
import ReactCalendar from 'react-calendar/dist/entry.nostyle';

const DATE_CACHE_FORMAT = 'MM-DD-YYYY';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    const now = moment();

    this._renderMonth = this._renderMonth.bind(this);
    this._calendarTileContent = this._calendarTileContent.bind(this);
    this._calendarTileClassName = this._calendarTileClassName.bind(this);
    this.state = {
      months: [ now, now.clone().add(1, 'months') ],
      datesWithNotes: {}
    };
  }
  componentDidMount() {
    this._search();
  }
  componentWillReceiveProps(newProps) {
    this._setDatesWithNotes(newProps.notes);
  }
  _setDatesWithNotes(notes) {
    this.setState({
      datesWithNotes: notes.reduce((result, note) => {
        note.dates.forEach(date => {
          if (typeof date === 'object') {

          } else {
            result[moment(date).format(DATE_CACHE_FORMAT)] = true;
          }
        });
        return result;
      }, {})
    }, () => {
      // console.log(this.state.datesWithNotes);
    });
  }
  _search() {
    const { months } = this.state;

    this.props.search(months[0], months[months.length - 1]);
  }
  _calendarTileContent(date, view) {
    return <small>1</small>;
  }
  _calendarTileClassName({ date, view }) {
    const m = moment(date);

    if (this.state.datesWithNotes[m.format(DATE_CACHE_FORMAT)]) {
      return 'withNotes';
    }
    return null;
  }
  _renderMonth(m) {
    return (
      <div>
        <div className='monthTitle'>{ m.format('MMMM YYYY') }</div>
        <ReactCalendar
          onChange={ () => console.log(arguments) }
          value={ m.toDate() }
          showNavigation={ false }
          tileContent={ this._calendarTileContent }
          tileClassName={ this._calendarTileClassName }/>
      </div>
    );
  }
  _addMonth(month, where) {
    if (where < 0) {
      this.setState({ months: [ month, ...this.state.months ]}, () => this._search());
    } else {
      this.setState({ months: [ ...this.state.months, month ]}, () => this._search());
    }
  }
  render() {
    const { months } = this.state;
    const past = months[0].clone().subtract(1, 'M');
    const future = months[months.length - 1].clone().add(1, 'M');

    return (
      <div className='calendar'>
        <div className='monthTitle'>
          <a onClick={ () => this._addMonth(past, -1) }>
            { past.format('MMMM YYYY') }
          </a>
        </div>
        { this.state.months.map((m, i) => <div key={ i }> { this._renderMonth(m) }</div>) }
        <div className='monthTitle'>
          <a onClick={ () => this._addMonth(future, 1) }>
            { future.format('MMMM YYYY') }
          </a>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  exit: PropTypes.func,
  search: PropTypes.func,
  notes: PropTypes.array
};

export default connect(Calendar)
  .with('Sidebar', 'Notes')
  .map((sidebar, notes) => ({
    exit: () => sidebar.close(),
    notes: notes.state.filtered,
    search: (from, to) => notes.searchByDateRange(from, to)
  }));
