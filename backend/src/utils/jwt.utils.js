const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

exports.signAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  });
};

exports.signRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.accessSecret);
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refreshSecret);
};
