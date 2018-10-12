const endIndex = (
  page,
  sizePerPage
) => (page * sizePerPage) - 1;

const startIndex = (
  end,
  sizePerPage,
) => end - (sizePerPage - 1);

export const alignPage = (
  data,
  page,
  sizePerPage
) => {
  const dataSize = data.length;

  if (page < 1 || page > (Math.floor(dataSize / sizePerPage) + 1)) {
    return 1;
  }
  return page;
};

export const getByCurrPage = (
  data,
  page,
  sizePerPage
) => {
    console.log('getByCurrPage', data,
        page,
        sizePerPage);
  const dataSize = data.length;
  if (!dataSize) return [];

  const end = endIndex(page, sizePerPage);
  const start = startIndex(end, sizePerPage);

  const result = [];
  for (let i = start; i <= end; i += 1) {
    result.push(data[i]);
    if (i + 1 === dataSize) break;
  }
  return result;
};
