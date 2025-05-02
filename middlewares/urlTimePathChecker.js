function urlTimePathChecker(req, res, next) {
  const url = req.originalUrl;
  const method = req.method;
  const time = new Date().toISOString();
  console.log(`URL: ${url}, Time: ${time}, Method: ${method}`);
  next();
}

export default urlTimePathChecker;
