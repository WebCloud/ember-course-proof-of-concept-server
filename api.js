'use strict';

const router = require('koa-router')();

router.get(
  '/users',
  function *(){
    const email = this.query.email;
    const password = this.query.password;
    const User = require('./db/models/user');

    const params = { email };

    if (typeof password !== 'undefined') {
      params.password = password;
    } else {
      params.name = this.query.name;
    }

    if (typeof email === 'undefined') {
      this.body = {
        data: { }
      };

      return;
    }

    const query = {
      where: params
    };

    const user = yield User.findOne(query);
    if (user != null) {
      this.body = {
        data: {
          type: 'users',
          id: user.id,
          attributes: {
            name: user.name,
            email: user.email
          }
        }
      };
    } else {
      this.body = {
        data: { }
      };
    }
  }
);

module.exports = router.routes();
