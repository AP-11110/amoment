// wrapper around async functions in order to avoid repeating try/catch
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next).catch(next));

module.exports = asyncHandler;
