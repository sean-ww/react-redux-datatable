/* eslint-disable no-param-reassign */
/**
 * Helper function to get an element's exact position
 *
 * Based on: https://www.kirupa.com/html5/get_element_position_using_javascript.htm
 *
 * @param {Object} element The element we are finding the position of.
 * @returns {{x: number, y: number}} The coordinates of the element.
 */
export default element => {
  let xPos = 0;
  let yPos = 0;

  while (element) {
    if (element.tagName === 'BODY') {
      // deal with browser quirks with body/window/document and page scroll
      const xScroll = element.scrollLeft || document.documentElement.scrollLeft;
      const yScroll = element.scrollTop || document.documentElement.scrollTop;

      xPos += element.offsetLeft - xScroll + element.clientLeft;
      yPos += element.offsetTop - yScroll + element.clientTop;
    } else {
      // for all other non-BODY elements
      xPos += element.offsetLeft - element.scrollLeft + element.clientLeft;
      yPos += element.offsetTop - element.scrollTop + element.clientTop;
    }

    element = element.offsetParent;
  }
  return {
    x: xPos,
    y: yPos,
  };
};
/* eslint-enable no-param-reassign */
