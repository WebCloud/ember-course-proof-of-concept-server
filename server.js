'use strict';

const koa = require('koa');
const app = koa();
const staticServer = require('koa-static');
const api = require('./api');
const runtime = process.env.npm_config_env; // jshint ignore:line
const gzip = require('koa-gzip');
const cors = require('koa-cors');

app.use(gzip());

if (!!runtime && runtime === 'dev') {
  app.use(function *responseTimeMiddleware(next) {
    const start = new Date();
    yield next;
    const ms = new Date() - start;
    this.set('X-Response-Time', `${ms}ms`);
  });

  app.use(function *URLCallResponsetime(next) {
    const start = new Date();
    yield next;
    const ms = new Date() - start;
    console.log(`${this.method} ${this.url} - ${ms}ms`);
  });
}

// user CORS
app.use(cors({ methods: ['GET', 'PATCH', 'PUT', 'POST', 'DELETE'] }));

// hook our API into the stack
app.use(api);

// initialize the static server
app.use(staticServer('./public'));

app.listen(3000);
