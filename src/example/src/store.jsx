import { applyMiddleware, createStore } from 'redux';

import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducer from './root.reducer';

const middlewares = [promise(), thunk];

const middleware = applyMiddleware(...middlewares);

export default createStore(reducer, middleware);
