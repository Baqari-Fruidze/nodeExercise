const filterServise = (query, reqQuery) => {
  let fileteredQuery = query;
  const productQueryFilter = ["name", "price", "description", "stock"];
  const filters = {};

  productQueryFilter.forEach((el) => {
    if (reqQuery[el]) {
      filters[el] = reqQuery[el];
    }
  });

  //////////////////////////////

  fileteredQuery = query.find(filters);
  excludeFields.forEach((el) => delete queryObj[el]);
  query = query.find(queryObj);
  if (req.query.sort) query = query.sort(req.query.sort);
  if (req.query.fields)
    query = query.select(req.query.fields.split(",").join(" "));
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  return fileteredQuery;
};

export default filterServise;
