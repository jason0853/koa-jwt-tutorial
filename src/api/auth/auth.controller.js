const User = require('models/user');

exports.register = async ctx => {
  const { username, password } = ctx.request.body;

  /**
   * 중복 체크
   */
  let existing = null;

  try {
    existing = await User.findByUsername(username);
  } catch (err) {
    ctx.throw(500, err);
  }

  if (existing) {
    ctx.status = 409;
    ctx.body = '이미 아이디가 존재합니다.';
    return;
  }

  /**
   * 새로운 계정 저장
   */
  let user = null;

  try {
    user = await User.create(username, password);
  } catch (err) {
    ctx.throw(500, err);
  }

  /**
   * admin 권한 부여
   */
  let count = null;

  try {
    count = await User.count();
  } catch (err) {
    ctx.throw(500, err);
  }

  if (count === 1) {
    await user.assignAdmin();
  }

  ctx.body = user;
};

exports.login = async ctx => {
  const { username, password } = ctx.request.body;

  /**
   * username 유무 체크
   */
  let user = null;

  try {
    user = await User.findByUsername(username);
  } catch (err) {
    ctx.throw(500, err);
  }

  if (!user) {
    ctx.status = 404;
    ctx.body = '유저네임을 찾을 수가 없습니다.';
    return;
  }

  /**
   * password 유무 체크
   */
  let pw = null;

  try {
    pw = await user.validatePassword(password);
  } catch (err) {
    ctx.throw(500, err);
  }

  if (!pw) {
    ctx.status = 403;
    ctx.body = '잘못된 비밀번호입니다.';
    return;
  }

  /**
   * token 발행
   */
  let token = null;

  try {
    token = await user.generateToken();
  } catch (err) {
    ctx.throw(500, err);
  }

  ctx.body = {
    message: `${user.username} 이 로그인 성공했습니다.`,
    token
  };
};

exports.check = async ctx => {
  ctx.body = {
    success: true,
    info: ctx.request.info
  };
};
