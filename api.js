'use strict';

const router = require('koa-router')();
const koaBody = require('koa-better-body');
const uploadDir = `${__dirname}/uploads`;

router.post(
  '/upload',
  koaBody({
    multipart: true,
    formLimit: '1gb',
    formidable: {
      uploadDir,
      keepExtensions: true
    }
  }),
  function *assetUploadEndpoint() {
    const uploaded = this.request.body.files.asset;
    const fileName = uploaded.path.replace(uploadDir, '');
    const image = `/img/psd_export${fileName}`;
    const User = require('./db/models/user');

    const asset = yield Asset.create({
      imagePath: image
    });

    this.body = {
      image
    };
  }
);

router.post(
  '/users',
  koaBody(),
  function *(){
    console.log(JSON.stringify(this.request.fields));
    const data = this.request.fields.data;
    if (typeof data === 'undefined') {
      this.body = {
        data: { }
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
          data: { }
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
        data: { }
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
)

module.exports = router.routes();
