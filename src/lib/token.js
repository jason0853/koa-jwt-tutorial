const jwtSecret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

exports.generateToken = function(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: '7d',
        issuer: 'jason0853.github.io',
        subject: 'userInfo'
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}

exports.jwtMiddleware = async (ctx, next) => {
  const token = ctx.headers['x-access-token'] || ctx.query.token;

  if (!token) {
    ctx.status = 403;
    ctx.body = {
      success: false,
      message: '접근 권한이 없습니다.'
    };
    return;
  }

  let decoded = null;

  try {
    decoded = await decodeToken(token);

    ctx.request.info = decoded;
  } catch (err) {
    if (!decoded) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'invalid token'
      };
      return;
    }
    ctx.throw(500, err);
  }

  return next();
};
