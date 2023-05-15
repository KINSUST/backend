

const queryFunction=(req)=>{
    // copy query
      let filters = { ...req.query };
  //sort ,page,limit exclude
  const excludeFilters = ["sort", "page", "limit"];
  excludeFilters.forEach((field) => delete filters[field]);

  //gt,lt,gt,lte
  let filterString = JSON.stringify(filters);
  //  /price[gt]=50&age[lt]=12 
  filterString = filterString.replace(
    /\b(gt|gte|lt|lte|eq,neq)\b/g,
    (match) => `$${match}`
  );
  // \b --> full block check

  filters = JSON.parse(filterString);
  const queries = {};

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queries.sortBy = sortBy;
  }
  // /fields=name,-_id,price
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queries.fields = fields;
  }
  //page

  if (req.query.page) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * Number(limit);
    queries.skip = skip;
    queries.limit = Number(limit); 
  }
  return {queries,filters};
}


module.exports=queryFunction