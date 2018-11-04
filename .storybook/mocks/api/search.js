import mingo from 'mingo';
import moment from 'moment';

const buildLikeExpression = (key, searchValue) => ({
  $where: function() {
    return this[key].toString().toLowerCase().includes(searchValue.toLowerCase());
  }
});

const isValidDate = value =>
  moment(value, 'YYYY-MM-DDTHH:mm:ss.sssZ', true).isValid()
  || moment(value, 'YYYY-MM-DD HH:mm:ss', true).isValid()
  || moment(value, 'YYYY-MM-DD', true).isValid();

const buildGteExpression = (key, searchValue) => {
  if (isValidDate(searchValue)) {
    return {
      $where: function() {
        return moment(this[key]).isSameOrAfter(searchValue);
      }
    }
  }
  return {
    $where: function () {
      return parseInt(this[key]) >= parseInt(searchValue);
    }
  }
};

const buildGtExpression = (key, searchValue) => {
  if (isValidDate(searchValue)) {
    return {
      $where: function() {
        return moment(this[key]).isAfter(searchValue);
      }
    }
  }
  return {
    $where: function () {
      return parseInt(this[key]) > parseInt(searchValue);
    }
  }
};

const buildLteExpression = (key, searchValue) => {
  if (isValidDate(searchValue)) {
    return {
      $where: function() {
        return moment(this[key]).isSameOrBefore(searchValue);
      }
    }
  }
  return {
    $where: function () {
      return parseInt(this[key]) <= parseInt(searchValue);
    }
  }
};

const buildLtExpression = (key, searchValue) => {
  if (isValidDate(searchValue)) {
    return {
      $where: function() {
        return moment(this[key]).isBefore(searchValue);
      }
    }
  }
  return {
    $where: function() {
      return parseInt(this[key]) < parseInt(searchValue);
    }
  }
};

const buildEqExpression = (key, searchValue) => {
  if (isValidDate(searchValue)) {
    return {
      $where: function() {
        return moment(this[key]).isSame(searchValue);
      }
    }
  }
  return {
    $where: function() {
      if (Number.isInteger(this[key])) return this[key] === parseInt(searchValue);
      return this[key] === searchValue;
    }
  }
};

const buildNeqExpression = (key, searchValue) => {
  if (isValidDate(searchValue)) {
    return {
      $where: function() {
        return !moment(this[key]).isSame(searchValue);
      }
    }
  }
  return {$ne: parseInt(searchValue)};
};

const generateSearchValueQuery = (searchValue, searchableColumns) => {
  if (!searchableColumns || searchValue === '' || searchableColumns.length < 1) return {};
  return {
    $or: searchableColumns.map(column => buildLikeExpression(column, searchValue))
  };
};

const generateFilterQuery = columnFilters => {
  if (!columnFilters || columnFilters.length < 1) return {};

  return {
    $and: columnFilters.reduce((filters, {key, type, value}) => {
      if (type === 'like') {
        return [
          ...filters,
          {[key]: buildLikeExpression(key, value)}
        ];
      }

      if (type === 'in') {
        return [
          ...filters,
          {[key]: {$in: value}}
        ];
      }

      if (type === 'between') {
        return [
          ...filters,
          {[key]: buildGteExpression(key, value.from)},
          {[key]: buildLteExpression(key, value.to)}
        ];
      }

      if (type === 'eq') {
        return [
          ...filters,
          {[key]: buildEqExpression(key, value)}
        ];
      }

      if (type === 'nteq') {
        return [
          ...filters,
          {[key]: buildNeqExpression(key, value)}
        ];
      }

      if (type === 'gt') {
        return [
          ...filters,
          {[key]: buildGtExpression(key, value)}
        ];
      }

      if (type === 'gteq') {
        return [
          ...filters,
          {[key]: buildGteExpression(key, value)}
        ];
      }

      if (type === 'lt') {
        return [
          ...filters,
          {[key]: buildLtExpression(key, value)}
        ];
      }

      if (type === 'lteq') {
        return [
          ...filters,
          {[key]: buildLteExpression(key, value)}
        ];
      }

      return filters;
    }, [])
  };
};

const isAscending = sortOrder => sortOrder === 'asc' ? 1 : -1;

const generateSortOptions = (tableSettings, params) => {
  if (params.get('sortName') && params.get('sortOrder')) {
    return {[params.get('sortName')]: isAscending(params.get('sortOrder'))};
  }

  if (tableSettings.defaultSort && tableSettings.defaultSort.length === 2) {
    return {[tableSettings.defaultSort[0]]: isAscending(tableSettings.defaultSort[1])};
  }

  return {};
};

const search = (searchData, params) => {
  const tableSettings = JSON.parse(params.get('tableSettings'));
  const limit = params.get('limit');
  const offset = params.get('offset');
  const searchValue = params.get('searchValue');
  const columnFilters = JSON.parse(params.get('columnFilters'));

  mingo.setup({
    key: tableSettings.keyField
  });

  const searchableColumns = tableSettings.tableColumns
    .filter(column => column.searchable !== false)
    .map(column => column.key);
  const searchValueQuery = generateSearchValueQuery(searchValue, searchableColumns);
  const filterQuery = generateFilterQuery(columnFilters);
  const sortOptions = generateSortOptions(tableSettings, params);
  const query = {...searchValueQuery, ...filterQuery};

  const dataTotalSize = mingo
    .find(searchData.data, query)
    .count();

  const data = mingo
    .find(searchData.data, query)
    .skip(offset)
    .limit(limit)
    .sort(sortOptions)
    .all();

  return {
    searchSuccess: true,
    dataTotalSize,
    data
  };
};

module.exports = search;
