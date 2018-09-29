import { expect } from 'chai';
import getPostion from './getPosition';

describe('getPosition()', () => {
  it('should default to 0, 0', () => {
    expect(getPostion().x).to.equal(0);
    expect(getPostion().y).to.equal(0);
  });

  const scenario1 = {
    offsetLeft: 100,
    offsetTop: 60,
    scrollLeft: 0,
    scrollTop: 0,
    clientLeft: 0,
    clientTop: 0,
    expectedX: 100,
    expectedY: 60,
  };

  const scenario2 = {
    offsetLeft: 100,
    offsetTop: 200,
    scrollLeft: 50,
    scrollTop: 10,
    clientLeft: 20,
    clientTop: 40,
    expectedX: 70,
    expectedY: 230,
  };

  const assertions = [
    {
      testName: 'non body scenario 1',
      tagName: 'testElem',
      ...scenario1,
    },
    {
      testName: 'body scenario 1',
      tagName: 'BODY',
      ...scenario1,
    },
    {
      testName: 'non body scenario 2',
      tagName: 'testElem',
      ...scenario2,
    },
    {
      testName: 'body scenario 2',
      tagName: 'BODY',
      ...scenario2,
    },
  ];

  assertions.forEach(({
    testName,
    tagName,
    offsetLeft,
    offsetTop,
    scrollLeft,
    scrollTop,
    clientLeft,
    clientTop,
    expectedX,
    expectedY,
  }) => {
    it(`should return an elements coordinates (${testName})`, () => {
      const mockElement = {};
      mockElement.tagName = tagName;
      mockElement.offsetLeft = offsetLeft;
      mockElement.offsetTop = offsetTop;
      mockElement.scrollLeft = scrollLeft;
      mockElement.scrollTop = scrollTop;
      mockElement.clientLeft = clientLeft;
      mockElement.clientTop = clientTop;
      mockElement.offsetParent = null;
      expect(getPostion(mockElement).x).to.equal(expectedX);
      expect(getPostion(mockElement).y).to.equal(expectedY);
    });
  });
});
