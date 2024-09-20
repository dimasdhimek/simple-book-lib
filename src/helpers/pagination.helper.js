// helper for managing pagination in list function

const pagination = function (req) {
  const perPage = req.query.per_page > 0 ? parseInt(req.query.per_page) : 10;
  const page = req.query.page > 0 ? parseInt(req.query.page) : 1;

  return {
    offset: (page - 1) * perPage,
    limit: perPage,
  };
};

module.exports = pagination;
