'use strict';

const router = require('koa-router')();
const koaBody = require('koa-better-body');
const db = require('./db/index');

db.sync();

router.post(
  '/users',
  koaBody(),
  function *(){
    const data = this.request.fields.data;
    if (typeof data === 'undefined') {
      this.body = {
        data: null
      };

      return;
    }

    const email = data.attributes.email;
    const name = data.attributes.name;
    const password = data.attributes.password;
    const User = require('./db/models/user');

    if (typeof password === 'undefined'
      || typeof email === 'undefined'
      || typeof name === 'undefined') {
        this.body = {
          data: null
        };

        return;
    }

    const user = yield User.create({ name, email, password });
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
        data: null
      };
    }
  }
);

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
        data: null
      };

      return;
    }

    const query = {
      where: params
    };

    try {
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
          data: null
        };
      }
    } catch (e) {
      this.body = {
        data: null
      };
    }
  }
);

router.patch(
  '/users/:userId',
  koaBody(),
  function *(){
    const data = this.request.fields.data;
    if (typeof data === 'undefined') {
      this.body = {
        data: null
      };

      return;
    }

    const userId = this.params.userId;
    const email = data.attributes.email;
    const name = data.attributes.name;
    const password = data.attributes.password;
    const User = require('./db/models/user');

    if (typeof password === 'undefined'
      || typeof email === 'undefined'
      || typeof name === 'undefined') {
        this.body = {
          data: null
        };

        return;
    }

    const user = yield User.update(data.attributes, {
      where: {
        id: userId
      }
    });

    if (user != null) {
      this.body = {
        meta: { message: 'updated' }
      };
    } else {
      this.body = {
        data: null
      };
    }

  }
);

router.delete(
  '/users/:userId',
  function *(){
    const userId = this.params.userId;
    const User = require('./db/models/user');

    const deleted = yield User.destroy({
      where: {
        id: userId
      }
    });

    this.body = { meta: { deleted } };
  }
);

module.exports = router.routes();
