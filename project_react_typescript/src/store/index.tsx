import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import history from '@/utils/history';
import { routerMiddleware } from 'connected-react-router';

const store = applyMiddleware(routerMiddleware(history))(createStore)(rootReducer);
export default store;