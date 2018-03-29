query.exec = function () {
  // check to see if this query has already been executed
  // and if it has return the result right away
  const result = client.get('query key');
  if (result) {
    return result;
  }
  // otherwise issue the query *as normal*
  const result = runTheOriginalExecFunction();
  // then save the value in redis
  client.set('query key', result);
  return result;
}