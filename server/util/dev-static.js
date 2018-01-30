const path = require('path');

const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const proxy = require('http-proxy-middleware');

const serverConfig = require('../../build/webpack.config.server');

const serverRender = require('./server.render');

// 获取模板文件
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// const Module = module.constructor;
const NativeModule = require('module');
const vm = require('vm');

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
};

const mfs = new MemoryFs(); // 基于内存的文件系统
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
let serverBundle;
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  stats = stats.toJson();
  stats.errors.forEach(err => console.error(err)); // 输出错误
  stats.warnings.forEach(warn => console.warn(warn)); // 输出警告

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
  const bundle = mfs.readFileSync(bundlePath, 'utf8'); // 注意编码格式
  // const m = new Module();
  // m._compile(bundle, 'server-entry.js'); // 将 js string 代码 转换为 js 模块
  const m = getModuleFromString(bundle, 'server-entry.js');
  serverBundle = m.exports;
  // serverBundle = m.exports.default; // 注意是通过 export.default 导出的
  // createStoreMap = m.exports.createStoreMap; // 通过 export 导出的
});

module.exports = function (app) {
  // 解决静态资源路径问题
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }));

  app.get('*', (req, res, next) => {
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res);
    }).catch(next);
  });
};
