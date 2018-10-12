import _ from 'lodash';
import { LIST_ITEMS, PAGINATION_SIZE } from './constants';

// todo: add tests?
// todo: add jsdocs?
// todo: put in own helpers folder with index?
export const calculatePageCount = (sizePerPage, dataSize) => Math.ceil(dataSize / sizePerPage);

export const calculateFromTo = (currentPage, currentSizePerPage, dataSize) => {
  if (dataSize === 0) return [0, 0];

  const from = (currentPage - 1) * currentSizePerPage;
  const to = Math.min(currentSizePerPage * currentPage, dataSize);
  return [from + 1, to];
};

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

const getListItemTitle = page => {
  const matchListItem = [...LIST_ITEMS].filter(({ TEXT }) => TEXT === page);
  if (matchListItem) return matchListItem.TEXT;
  return `${page}`;
};

const generateListItems = (items = [], currentPage) =>
  items.map(page => ({
    page,
    active: page === currentPage,
    title: getListItemTitle(page),
  }));

export const createListItems = (currentPage, pageCount) => {
  const pages = generatePages(currentPage, pageCount);
  const firstPageItem = currentPage > 1 && !pages.includes(1) ? [LIST_ITEMS.FIRST.TEXT] : [];
  const previousPageItem = currentPage > 1 ? [LIST_ITEMS.PREVIOUS.TEXT] : [];
  const nextPageItem = currentPage < pageCount ? [LIST_ITEMS.NEXT.TEXT] : [];
  const lastPageItem = currentPage < pageCount && !pages.includes(pageCount) ? [LIST_ITEMS.LAST.TEXT] : [];

  const listArray = [...firstPageItem, ...previousPageItem, ...pages, ...nextPageItem, ...lastPageItem];

  return generateListItems(listArray, currentPage);
};
