exports.SearchOptions = (req) => {
  if (req.query.option == 'title') {
    return [{ title: new RegExp(req.query.content) }];
  } else if (req.query.option == 'description') {
    return [{ content: new RegExp(req.query.content) }];
  } else if (req.query.option == 'title+description') {
    return [
      { title: new RegExp(req.query.content) },
      { content: new RegExp(req.query.content) },
    ];
  } else {
    throw '검색 옵션 없음';
  }
};
