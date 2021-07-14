exports.SearchOptions = (req) => {
  if (req.query.option == 'title') {
    const options = [{ title: new RegExp(req.query.content) }];
    return options;
  } else if (req.query.option == 'description') {
    const options = [{ content: new RegExp(req.query.content) }];
    return options;
  } else if (req.query.option == 'title+description') {
    const options = [
      { title: new RegExp(req.query.content) },
      { content: new RegExp(req.query.content) },
    ];
    return options;
  } else {
    throw '검색 옵션 없음';
  }
};
