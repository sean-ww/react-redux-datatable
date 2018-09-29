import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory, useBasename } from 'history';

import store from './store';

import Example from './example';

const history = useBasename(createHistory)({
  basename: window.location.pathname,
});

const app = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/">
        <IndexRoute component={Example} />
      </Route>
    </Router>
  </Provider>,
  app,
);
