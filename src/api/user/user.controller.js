const User = require('models/user');

exports.list = async ctx => {
  const { admin } = ctx.request.info;

  if (!admin) {
    ctx.status = 403;
    ctx.body = '권한이 없습니다.';
    return;
  }

  let list = null;

  try {
    list = await User.getAllList();
  } catch (err) {
    ctx.throw(500, err);
  }

  ctx.body = list;
};

exports.assignAdmin = async ctx => {
  const { admin } = ctx.request.info;
  const { username } = ctx.params;

  if (!admin) {
    ctx.status = 403;
    ctx.body = '권한이 없습니다.';
    return;
  }

  let user = null;

  try {
    user = await User.findByUsername(username);
    await user.assignAdmin();
  } catch (err) {
    ctx.throw(500, err);
  }

  ctx.body = user;
};
