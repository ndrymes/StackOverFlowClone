const meta = (limit, skip, count) => {
  let previousPage = true;
  if (skip <= 0) {
    previousPage = false;
  }
  const page = (limit + skip) / limit;
  let nextPage = page + 1;
  nextPage = Math.round(nextPage);

  let pageCount = Math.round(count / limit);
  if (count < limit) {
    pageCount = 1;
  }

  return {
    page,
    limit,
    previousPage,
    nextPage,
    pageCount,
    total: count
  };
};
module.exports = meta;
