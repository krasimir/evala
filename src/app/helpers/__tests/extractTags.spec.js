import extractTags from '../extractTags';

describe('When using the extractTags helper', () => {
  [
    {
      text: 'no tags at all',
      expected: { tags: [], dates: [] }
    },
    {
      text: 'something with tags #today #calendar #awesome!@$%^&*()_+',
      expected: {
        tags: ['#today', '#calendar', '#awesome!@$%^&*()_+'],
        dates: []
      }
    }
  ].forEach(({ text, expected }) => {
    describe(`when passing ${ text }`, () => {
      it('should meet the expectations', () => {
        expect(extractTags(text)).toEqual(expected);
      });
    });
  });
});
