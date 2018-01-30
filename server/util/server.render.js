const ReactDOMServer = require('react-dom/server');
const ejs = require('ejs');
const asyncBootstrap = require('react-async-bootstrapper').default;
const serialize = require('serialize-javascript');
const Helmet = require('react-helmet').default;
const { SheetsRegistry } = require('react-jss/lib/jss');
const { createMuiTheme, createGenerateClassName } = require('material-ui/styles');
const { lightBlue, pink } = require('material-ui/colors');

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
};

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap;
    const createApp = bundle.default;

    const routerContext = {};
    const stores = createStoreMap();

    const sheetsRegistry = new SheetsRegistry();
    const theme = createMuiTheme({
      palette: {
        primary: lightBlue,
        accent: pink,
        type: 'light'
      }
    });
    const generateClassName = createGenerateClassName();

    const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url);

    asyncBootstrap(app).then(() => { // 处理初始化异步操作
      if (routerContext.url) { // 处理 Redirect 情况
        res.status(302).setHeader('Location', routerContext.url);
        res.end();
        return;
      }
      const state = getStoreState(stores);
      const content = ReactDOMServer.renderToString(app);
      const helmet = Helmet.rewind();
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      });
      res.send(html);
      resolve();
      // res.send(template.replace('<!-- app -->', content));
    }).catch(reject);
  });
};
