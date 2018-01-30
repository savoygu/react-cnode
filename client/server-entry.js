import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import App from './views/App';

import { createStoreMap } from './store/store';

// 让 mobx 在服务端渲染的时候不会重复数据变换
useStaticRendering(true);

export default (stores, context, location) => (
  <Provider {...stores}>
    <StaticRouter context={context} location={location}>
      <App />
    </StaticRouter>
  </Provider>
);

export {
  createStoreMap,
};
