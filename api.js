'use strict';

const router = require('koa-router')();
const koaBody = require('koa-better-body');
const db = require('./db/index');

// Users

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

    yield db.sync();

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

    yield db.sync();

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

    yield db.sync();

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

    yield db.sync();

    const deleted = yield User.destroy({
      where: {
        id: userId
      }
    });

    this.body = { meta: { deleted } };
  }
);


// Todos

router.post(
  '/todos',
  koaBody(),
  function *(){
    const data = this.request.fields.data;
    if (typeof data === 'undefined') {
      this.body = {
        data: null
      };

      return;
    }

    const title = data.attributes.title;
    const isDone = false;
    let userId = undefined;

    try {
      userId = data.relationships.user.data.id;
    } catch (e) {
      this.body = {
        data: null
      };

      return;
    }

    const Todo = require('./db/models/todo');
    const User = require('./db/models/user');

    yield db.sync();

    if (typeof title === 'undefined') {
        this.body = {
          data: null
        };

        return;
    }

    const todo = yield Todo.create({ title, isDone, userId }, { include: [User] });
    if (todo != null) {
      this.body = {
        data: {
          type: 'todos',
          id: todo.id,
          attributes: {
            title: todo.title,
            isDone: todo.isDone
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: userId
              }
            }
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
  '/todos',
  function *(){
    const userId = this.query.userId;

    const Todo = require('./db/models/todo');
    const User = require('./db/models/user');

    yield db.sync();

    if (typeof userId === 'undefined') {
      this.body = {
        data: []
      };

      return;
    }

    try {
      const todos = yield Todo.findAll({
        include: [{
          model: User,
          where: { id: userId }
        }]
      }).then((list) => list.map((todo) => ({
        type: 'todos',
        id: todo.id,
        attributes: {
          title: todo.title
        }
      })));

      if (todos != null) {
        this.body = { data: todos };
      } else {
        this.body = {
          data: []
        };
      }
    } catch (e) {
      console.log(e);
      this.body = {
        data: []
      };
    }
  }
);

router.patch(
  '/todos/:postId',
  koaBody(),
  function *(){
    const data = this.request.fields.data;
    if (typeof data === 'undefined') {
      this.body = {
        data: null
      };

      return;
    }

    const postId = this.params.postId;
    const title = data.attributes.title;
    const Todo = require('./db/models/todo');

    yield db.sync();

    if (typeof title === 'undefined') {
        this.body = {
          data: null
        };

        return;
    }

    const todo = yield Todo.update(data.attributes, {
      where: {
        id: postId
      }
    });

    if (todo != null) {
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
  '/todos/:todoId',
  function *(){
    const todoId = this.params.todoId;
    const Todo = require('./db/models/todo');

    yield db.sync();

    const deleted = yield Todo.destroy({
      where: {
        id: todoId
      }
    });

    this.body = { meta: { deleted } };
  }
);

module.exports = router.routes();
