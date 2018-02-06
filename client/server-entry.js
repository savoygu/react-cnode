import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from 'material-ui/styles';

import App from './views/App';
import { createStoreMap } from './store/store';

// 让 mobx 在服务端渲染的时候不会重复数据变换
useStaticRendering(true);

export default (stores, context, sheetsRegistry, generateClassName, theme, location) => (
  <Provider {...stores}>
    <StaticRouter context={context} location={location}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  </Provider>
);

export {
  createStoreMap,
};
