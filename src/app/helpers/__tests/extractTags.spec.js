import extractTags from '../extractTags';
import moment from 'moment';

describe('When using the extractTags helper', () => {
  [
    {
      text: 'no tags at all',
      expected: {
        tags: [],
        dates: []
      }
    },
    {
      text: 'something with tags #today #calendar #awesome!@$%^&*()_+',
      expected: {
        tags: ['#today', '#calendar', '#awesome!@$%^&*()_+'],
        dates: []
      }
    },
    {
      text: 'valid dates #2.2.2018 #today #4.13.2018',
      expected: {
        tags: ['#today'],
        dates: [1517522400000, 1523566800000]
      },
      expectedDates: ['February 02 2018, 00:00', 'April 13 2018, 00:00']
    },
    {
      text: 'date and time together #2.5.2018-15:00 #something',
      expected: {
        tags: ['#something'],
        dates: [1517835600000]
      },
      expectedDates: ['February 05 2018, 15:00']
    },
    {
      text: 'using dashes #01-02-2018-13:45',
      expected: {
        tags: [],
        dates: [1514893500000]
      },
      expectedDates: ['January 02 2018, 13:45']
    },
    {
      text: 'using ranges #04-28-2018-10:12_04.29.2018-15:30 foo bar',
      expected: {
        tags: [],
        dates: [{ from: 1524899520000, to: 1525005000000 }]
      },
      expectedRangeDates: [{ from: 'April 28 2018, 10:12', to: 'April 29 2018, 15:30' }]
    }
  ].forEach(({ text, expected, expectedDates, expectedRangeDates }) => {
    describe(`when passing "${ text }"`, () => {
      it('should meet the expectations', () => {
        const { tags, dates } = extractTags(text);

        expect({ tags, dates }).toEqual(expected);
        if (expectedDates) {
          expect(dates.map(stamp => moment(stamp).format('MMMM DD YYYY, HH:mm'))).toEqual(expectedDates);
        }
        if (expectedRangeDates) {
          expect(dates.map(stamp => ({
            from: moment(stamp.from).format('MMMM DD YYYY, HH:mm'),
            to: moment(stamp.to).format('MMMM DD YYYY, HH:mm')
          }))).toEqual(expectedRangeDates);
        }
      });
    });
  });
});
