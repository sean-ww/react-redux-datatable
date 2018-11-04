import _ from 'lodash';
import { LIST_ITEMS, PAGINATION_SIZE } from './constants';

/**
 * Check if all given values are greater than 0
 *
 * @param {array} values An array of values.
 * @returns {boolean} True if all values are greater than 0.
 */
const valuesGreaterThanZero = values => values.every(value => value > 0);

/**
 * Calculate the number of pages based on the size per page and data size
 *
 * @param {number} sizePerPage The number of rows shown per page.
 * @param {number} dataSize The total size of the data.
 * @returns {number} The number of pages.
 */
export const calculatePageCount = (sizePerPage, dataSize) =>
  valuesGreaterThanZero([sizePerPage, dataSize]) ? Math.ceil(dataSize / sizePerPage) : 0;

/**
 * Calculate the From and To row values for the current page
 *
 * @param {number} currentPage The current page selected.
 * @param {number} currentSizePerPage The number of rows shown per page.
 * @param {number} dataSize The total size of the data.
 * @returns {number[]} The From and To values in an array.
 */
export const calculateFromTo = (currentPage, currentSizePerPage, dataSize) => {
  if (!valuesGreaterThanZero([currentPage, currentSizePerPage, dataSize])) return [0, 0];

  const from = (currentPage - 1) * currentSizePerPage;
  const to = Math.min(currentSizePerPage * currentPage, dataSize);
  return [from + 1, to];
};

/**
 * Generate an array of pagination pages (with PAGINATION_SIZE)
 *
 * @param {number} currentPage The current page selected.
 * @param {number} pageCount The total number of pages.
 * @returns {array} An array of page numbers.
 */
const generatePages = (currentPage, pageCount) => {
  if (pageCount <= 0) return [];

  let startPage = Math.max(currentPage - Math.floor(PAGINATION_SIZE / 2), 1);
  let endPage = startPage + PAGINATION_SIZE - 1;

  if (endPage > pageCount) {
    endPage = pageCount;
    startPage = Math.max(endPage - PAGINATION_SIZE + 1, 1);
  }

  return _.range(startPage, endPage + 1);
};

/**
 * Retrieve the LIST_ITEM.TITLE for a page
 *
 * @param {string} page The page button text (e.g. '1', '2' or '>>')
 * @returns {string} The text to be used for the page title attribute.
 */
const getListItemTitle = page => {
  const matchListItem = Object.values(LIST_ITEMS).filter(({ TEXT }) => TEXT === page)[0];
  if (matchListItem) return matchListItem.TITLE;
  return `${page}`;
};

/**
 * Generate list item objects
 *
 * @param {array} items An array of list item text strings.
 * @param {number} currentPage The current page selected.
 * @returns {{page: *, active: boolean, title: string}[]} An array of list item objects.
 */
const generateListItems = (items = [], currentPage) =>
  items.map(page => ({
    page,
    active: page === currentPage,
    title: getListItemTitle(page),
  }));

/**
 * Create a list of pagination list item objects
 *
 * @param {number} currentPage The current page selected.
 * @param {number} pageCount The total number of pages.
 * @returns {array} An array of list item objects.
 */
export const createListItems = (currentPage, pageCount) => {
  if (!valuesGreaterThanZero([currentPage, pageCount])) return [];

  const pages = generatePages(currentPage, pageCount);
  const firstPageItem = currentPage > 1 && !pages.includes(1) ? [LIST_ITEMS.FIRST.TEXT] : [];
  const previousPageItem = currentPage > 1 ? [LIST_ITEMS.PREVIOUS.TEXT] : [];
  const nextPageItem = currentPage < pageCount ? [LIST_ITEMS.NEXT.TEXT] : [];
  const lastPageItem = currentPage < pageCount && !pages.includes(pageCount) ? [LIST_ITEMS.LAST.TEXT] : [];

  const listArray = [...firstPageItem, ...previousPageItem, ...pages, ...nextPageItem, ...lastPageItem];

  return generateListItems(listArray, currentPage);
};
