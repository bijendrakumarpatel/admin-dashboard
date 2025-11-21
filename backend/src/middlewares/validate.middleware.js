const { error } = require("../utils/response");

exports.validateBody = (schema) => (req, res, next) => {
  const { error: err } = schema.validate(req.body, { abortEarly: false });
  if (err) {
    return error(
      res,
      "Validation failed",
      422,
      err.details.map((d) => d.message)
    );
  }
  next();
};
