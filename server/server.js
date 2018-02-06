const path = require('path');
const fs = require('fs');

const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');

const serverRender = require('./util/server.render');

const isDev = process.env.NODE_ENV === 'development';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'cnode',
  resave: false,
  saveUninitialized: false,
  secret: 'react-cnode'
}));

app.use(favicon(path.join(__dirname, '../favicon.ico')));

app.use('/api/user', require('./util/handle-login'));
app.use('/api', require('./util/proxy'));

if (!isDev) { // 生产环境
  const serverEntry = require('../dist/server-entry');
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8');

  app.use('/public', express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res, next) => {
    serverRender(serverEntry, template, req, res).catch(next);
    // const appString = ReactDOMServer.renderToString(serverEntry);
    // res.send(template.replace('<!-- app -->', appString));
  });
} else { // 开发环境
  const devStatic = require('./util/dev-static');
  devStatic(app);
}

app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).send(error);
});

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3333;
app.listen(port, host, () => {
  console.log(`Server started on 3333`);
});
