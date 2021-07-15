exports.SearchOptions = (req) => {
  if (req.query.option == 'title') {
    return [{ title: new RegExp(req.query.keyword) }];
  } else if (req.query.option == 'description') {
    return [{ description: new RegExp(req.query.keyword) }];
  } else if (req.query.option == 'titledescription') {
    return [
      { title: new RegExp(req.query.keyword) },
      { description: new RegExp(req.query.keyword) },
    ];
  } else {
    throw '검색 옵션 없음';
  }
};
