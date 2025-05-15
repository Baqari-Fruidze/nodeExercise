const filterServise = (query, reqQuery) => {
  let fileteredQuery = query;
  const productQueryFilter = [
    "name",
    "price",
    "description",
    "stock",
    "category",
  ];
  const filters = {};

  productQueryFilter.forEach((el) => {
    if (reqQuery[el]) {
      filters[el] = reqQuery[el];
    }
  });

  //////////////////////////////

  fileteredQuery = query.find(filters);

  if (reqQuery.sort) {
    fileteredQuery = query.sort(reqQuery.sort);
  }
  if (reqQuery.fields) {
    fileteredQuery = fileteredQuery.select(
      reqQuery.fields.split(",").join(" ")
    );
  }

  const page = reqQuery.page * 1 || 1;
  const limit = reqQuery.limit * 1 || 100;
  const skip = (page - 1) * limit;
  fileteredQuery = fileteredQuery.skip(skip).limit(limit);
  return fileteredQuery;
};

export default filterServise;
