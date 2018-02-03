import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import ReactCalendar from 'react-calendar/dist/entry.nostyle';
import Search from './Search';
import Editor from './Editor';

const moment = extendMoment(Moment);

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
      datesWithNotes: {},
      selectedDay: now
    };
  }
  componentDidMount() {
    this._search();
  }
  componentWillReceiveProps(newProps) {
    this._setDatesWithNotes(newProps.notes);
  }
  _addDateWithNote(result, day, note) {
    const key = moment(day).format(DATE_CACHE_FORMAT);

    if (!result[key]) result[key] = [];
    result[key].push(note);

    return result;
  }
  _setDatesWithNotes(notes) {
    this.setState({
      datesWithNotes: notes.reduce((result, note) => {
        note.dates.forEach(date => {
          if (typeof date === 'object') {
            const range = moment.range(date.from, date.to);

            for (let day of range.by('day')) {
              result = this._addDateWithNote(result, day, note);
            }
          } else {
            result = this._addDateWithNote(result, date, note);
          }
        });
        return result;
      }, {})
    });
  }
  _search() {
    const { months } = this.state;

    this.props.search(months[0], months[months.length - 1]);
  }
  _calendarTileContent({ date, view }) {
    const m = moment(date);
    const notes = this.state.datesWithNotes[m.format(DATE_CACHE_FORMAT)];

    if (notes) {
      return <sup>{ notes.length }</sup>;
    }
    return null;
  }
  _calendarTileClassName({ date, view }) {
    const m = moment(date);
    const result = [];

    if (this.state.datesWithNotes[m.format(DATE_CACHE_FORMAT)]) {
      result.push('withNotes');
    }
    if (m.isSame(moment(), 'day')) {
      result.push('today');
    }
    if (m.isSame(this.state.selectedDay, 'day')) {
      result.push('selected');
    }
    return result.join(' ');
  }
  _addMonth(month, where) {
    if (where < 0) {
      this.setState({ months: [ month, ...this.state.months ]}, () => this._search());
    } else {
      this.setState({ months: [ ...this.state.months, month ]}, () => this._search());
    }
  }
  _renderNotes() {
    var { selectedDay } = this.state;

    if (!selectedDay) return null;

    selectedDay = moment(selectedDay);

    const notes = this.state.datesWithNotes[selectedDay.format(DATE_CACHE_FORMAT)];

    if (!notes || notes.length === 0) {
      return <Editor />;
    }
    return <Search notes={ notes } listOnly />;
  }
  _renderMonth(m) {
    return (
      <div>
        <div className='monthTitle'>{ m.format('MMMM YYYY') }</div>
        <ReactCalendar
          onClickDay={ selectedDay => this.setState({ selectedDay }) }
          value={ m.toDate() }
          showNavigation={ false }
          tileContent={ this._calendarTileContent }
          tileClassName={ this._calendarTileClassName }/>
      </div>
    );
  }
  render() {
    const { months } = this.state;
    const past = months[0].clone().subtract(1, 'M');
    const future = months[months.length - 1].clone().add(1, 'M');

    return (
      <div className='calendar'>
        <div className='calendarMonths'>
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
        { this._renderNotes() }
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
    notes: notes.state.filteredByDate,
    search: (from, to) => notes.searchByDateRange(from, to)
  }));
